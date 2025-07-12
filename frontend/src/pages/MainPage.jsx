import React, { useState, useEffect } from 'react';
import ChatRoomList from '../components/ChatRoomList';
import GlobalChat from '../components/GlobalChat';
import ChatRoomInfo from '../components/ChatRoomInfo';
import CreateRoomModal from '../components/CreateRoomModal';
import { useAuth } from '../context/AuthContext';

const MainPage = () => {
  const { user } = useAuth();
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [filters, setFilters] = useState({
    teamMode: '',
    itemMode: '',
    rankMode: '',
    search: ''
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // 채팅방 목록 조회
  const fetchChatRooms = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.teamMode !== '') params.append('teamMode', filters.teamMode);
      if (filters.itemMode !== '') params.append('itemMode', filters.itemMode);
      if (filters.rankMode !== '') params.append('rankMode', filters.rankMode);
      if (filters.search) params.append('search', filters.search);

      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/chatrooms?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setChatRooms(data);
      } else {
        console.error('채팅방 목록 조회 실패');
      }
    } catch (error) {
      console.error('채팅방 목록 조회 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  // 채팅방 상세 정보 조회
  const fetchChatRoomInfo = async (roomId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/chatrooms/${roomId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedRoom(data);
      } else {
        console.error('채팅방 정보 조회 실패');
      }
    } catch (error) {
      console.error('채팅방 정보 조회 오류:', error);
    }
  };

  // 채팅방 생성
  const handleCreateRoom = async (roomData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/chatrooms', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(roomData)
      });

      if (response.ok) {
        const newRoom = await response.json();
        setChatRooms(prev => [newRoom, ...prev]);
        setIsCreateModalOpen(false);
        // 새로 생성된 방을 선택
        setSelectedRoom(newRoom);
      } else {
        console.error('채팅방 생성 실패');
      }
    } catch (error) {
      console.error('채팅방 생성 오류:', error);
    }
  };

  // 필터 변경
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // 검색
  const handleSearch = (searchTerm) => {
    setFilters(prev => ({
      ...prev,
      search: searchTerm
    }));
  };

  // 새로고침
  const handleRefresh = () => {
    fetchChatRooms();
  };

  // 채팅방 선택
  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
  };

  useEffect(() => {
    fetchChatRooms();
  }, [filters]);

  useEffect(() => {
    if (selectedRoom) {
      fetchChatRoomInfo(selectedRoom._id);
    }
  }, [selectedRoom?._id]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 좌측 패널 */}
      <div className="flex flex-col w-1/2">
        {/* 상단: 채팅방 목록 */}
        <div className="flex-1 bg-white border-r border-gray-200">
          <ChatRoomList
            chatRooms={chatRooms}
            filters={filters}
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
            onRefresh={handleRefresh}
            onCreateRoom={() => setIsCreateModalOpen(true)}
            onRoomSelect={handleRoomSelect}
            selectedRoom={selectedRoom}
            loading={loading}
          />
        </div>
        
        {/* 하단: 전체 채팅창 */}
        <div className="h-1/3 bg-white border-t border-gray-200">
          <GlobalChat />
        </div>
      </div>

      {/* 우측: 채팅방 정보 */}
      <div className="w-1/2 bg-white">
        <ChatRoomInfo 
          selectedRoom={selectedRoom}
          onJoinRoom={fetchChatRooms}
          onLeaveRoom={fetchChatRooms}
        />
      </div>

      {/* 채팅방 생성 모달 */}
      <CreateRoomModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateRoom={handleCreateRoom}
      />
    </div>
  );
};

export default MainPage; 