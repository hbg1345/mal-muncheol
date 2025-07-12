import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const ChatRoomInfo = ({ selectedRoom, onJoinRoom, onLeaveRoom }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleJoinRoom = async () => {
    if (!selectedRoom) return;
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/chatrooms/${selectedRoom._id}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        onJoinRoom();
      } else {
        const error = await response.json();
        alert(error.message || '채팅방 참가에 실패했습니다.');
      }
    } catch (error) {
      console.error('채팅방 참가 오류:', error);
      alert('채팅방 참가 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveRoom = async () => {
    if (!selectedRoom) return;
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/chatrooms/${selectedRoom._id}/leave`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        onLeaveRoom();
      } else {
        const error = await response.json();
        alert(error.message || '채팅방 나가기에 실패했습니다.');
      }
    } catch (error) {
      console.error('채팅방 나가기 오류:', error);
      alert('채팅방 나가기 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const isParticipant = selectedRoom?.participants?.some(
    participant => participant._id === user?.id || participant === user?.id
  );

  if (!selectedRoom) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-2xl mb-2">🏠</div>
          <p>채팅방을 선택해주세요</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-2">{selectedRoom.name}</h2>
        
        {/* 태그들 */}
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedRoom.isTeamMode && (
            <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">팀전</span>
          )}
          {selectedRoom.isItemMode && (
            <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">아이템전</span>
          )}
          {selectedRoom.isRankMode && (
            <span className="px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded-full">랭크전</span>
          )}
        </div>

        {/* 참가/나가기 버튼 */}
        <div className="flex gap-2">
          {!isParticipant ? (
            <button
              onClick={handleJoinRoom}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? '참가 중...' : '참가하기'}
            </button>
          ) : (
            <button
              onClick={handleLeaveRoom}
              disabled={loading}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
            >
              {loading ? '나가는 중...' : '나가기'}
            </button>
          )}
        </div>
      </div>

      {/* 채팅방 정보 */}
      <div className="flex-1 p-6 space-y-6">
        {/* 기본 정보 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-3">기본 정보</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">생성자:</span>
              <span className="font-medium">{selectedRoom.creator?.kakaoId || '알 수 없음'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">참가자 수:</span>
              <span className="font-medium">{selectedRoom.participants?.length || 0}명</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">최대 참가자:</span>
              <span className="font-medium">{selectedRoom.maxParticipants || 10}명</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">배심원 수:</span>
              <span className="font-medium">{selectedRoom.jurors || 0}명</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">생성일:</span>
              <span className="font-medium">
                {new Date(selectedRoom.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* 참가자 목록 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-3">참가자 목록</h3>
          {selectedRoom.participants && selectedRoom.participants.length > 0 ? (
            <div className="space-y-2">
              {selectedRoom.participants.map((participant, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">
                    {participant.kakaoId || '알 수 없음'}
                  </span>
                  {participant._id === selectedRoom.creator?._id && (
                    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                      방장
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">참가자가 없습니다.</p>
          )}
        </div>

        {/* 게임 설정 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-3">게임 설정</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">게임 모드:</span>
              <span className="font-medium">
                {selectedRoom.isTeamMode ? '팀전' : '개인전'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">아이템:</span>
              <span className="font-medium">
                {selectedRoom.isItemMode ? '사용' : '미사용'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">랭킹:</span>
              <span className="font-medium">
                {selectedRoom.isRankMode ? '랭크전' : '일반전'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoomInfo; 