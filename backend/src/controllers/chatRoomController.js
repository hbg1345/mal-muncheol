import ChatRoom from '../models/ChatRoom.js';
import User from '../models/User.js';

// 채팅방 목록 조회
export const getChatRooms = async (req, res) => {
  try {
    const { teamMode, itemMode, rankMode, search } = req.query;
    
    let filter = { isActive: true };
    
    if (teamMode !== undefined) {
      filter.isTeamMode = teamMode === 'true';
    }
    if (itemMode !== undefined) {
      filter.isItemMode = itemMode === 'true';
    }
    if (rankMode !== undefined) {
      filter.isRankMode = rankMode === 'true';
    }
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const chatRooms = await ChatRoom.find(filter)
      .populate('creator', 'kakaoId')
      .populate('participants', 'kakaoId')
      .sort({ createdAt: -1 });

    res.json(chatRooms);
  } catch (error) {
    res.status(500).json({ message: '채팅방 목록 조회 실패', error: error.message });
  }
};

// 채팅방 생성
export const createChatRoom = async (req, res) => {
  try {
    const { name, isTeamMode, isItemMode, isRankMode, maxParticipants } = req.body;
    const creatorId = req.user._id; // 인증 미들웨어에서 설정된 사용자 ID

    const chatRoom = new ChatRoom({
      name,
      creator: creatorId,
      participants: [creatorId],
      isTeamMode: isTeamMode || false,
      isItemMode: isItemMode || false,
      isRankMode: isRankMode || false,
      maxParticipants: maxParticipants || 10,
    });

    const savedChatRoom = await chatRoom.save();
    const populatedChatRoom = await ChatRoom.findById(savedChatRoom._id)
      .populate('creator', 'kakaoId')
      .populate('participants', 'kakaoId');

    res.status(201).json(populatedChatRoom);
  } catch (error) {
    res.status(500).json({ message: '채팅방 생성 실패', error: error.message });
  }
};

// 채팅방 상세 정보 조회
export const getChatRoom = async (req, res) => {
  try {
    const { id } = req.params;
    
    const chatRoom = await ChatRoom.findById(id)
      .populate('creator', 'kakaoId')
      .populate('participants', 'kakaoId');

    if (!chatRoom) {
      return res.status(404).json({ message: '채팅방을 찾을 수 없습니다.' });
    }

    res.json(chatRoom);
  } catch (error) {
    res.status(500).json({ message: '채팅방 조회 실패', error: error.message });
  }
};

// 채팅방 참가
export const joinChatRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const chatRoom = await ChatRoom.findById(id);
    if (!chatRoom) {
      return res.status(404).json({ message: '채팅방을 찾을 수 없습니다.' });
    }

    if (chatRoom.participants.includes(userId)) {
      return res.status(400).json({ message: '이미 참가 중인 채팅방입니다.' });
    }

    if (chatRoom.participants.length >= chatRoom.maxParticipants) {
      return res.status(400).json({ message: '채팅방이 가득 찼습니다.' });
    }

    chatRoom.participants.push(userId);
    await chatRoom.save();

    const updatedChatRoom = await ChatRoom.findById(id)
      .populate('creator', 'kakaoId')
      .populate('participants', 'kakaoId');

    res.json(updatedChatRoom);
  } catch (error) {
    res.status(500).json({ message: '채팅방 참가 실패', error: error.message });
  }
};

// 채팅방 나가기
export const leaveChatRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const chatRoom = await ChatRoom.findById(id);
    if (!chatRoom) {
      return res.status(404).json({ message: '채팅방을 찾을 수 없습니다.' });
    }

    chatRoom.participants = chatRoom.participants.filter(
      participant => participant.toString() !== userId.toString()
    );

    // 참가자가 없으면 채팅방 비활성화
    if (chatRoom.participants.length === 0) {
      chatRoom.isActive = false;
    }

    await chatRoom.save();

    const updatedChatRoom = await ChatRoom.findById(id)
      .populate('creator', 'kakaoId')
      .populate('participants', 'kakaoId');

    res.json(updatedChatRoom);
  } catch (error) {
    res.status(500).json({ message: '채팅방 나가기 실패', error: error.message });
  }
}; 