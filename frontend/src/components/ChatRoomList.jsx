import React, { useState } from 'react';

const ChatRoomList = ({
  chatRooms,
  filters,
  onFilterChange,
  onSearch,
  onRefresh,
  onCreateRoom,
  onRoomSelect,
  selectedRoom,
  loading
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleSearchClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">채팅방 목록</h2>
        
        {/* 필터 및 검색 */}
        <div className="space-y-3">
          {/* 필터 */}
          <div className="flex flex-wrap gap-2">
            <select
              value={filters.teamMode}
              onChange={(e) => onFilterChange('teamMode', e.target.value)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">팀전/개인전</option>
              <option value="true">팀전</option>
              <option value="false">개인전</option>
            </select>

            <select
              value={filters.itemMode}
              onChange={(e) => onFilterChange('itemMode', e.target.value)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">아이템전</option>
              <option value="true">아이템전</option>
              <option value="false">일반전</option>
            </select>

            <select
              value={filters.rankMode}
              onChange={(e) => onFilterChange('rankMode', e.target.value)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">개인/랭크전</option>
              <option value="true">랭크전</option>
              <option value="false">개인전</option>
            </select>
          </div>

          {/* 검색 */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="채팅방 검색..."
              className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              검색
            </button>
            {searchTerm && (
              <button
                type="button"
                onClick={handleSearchClear}
                className="px-3 py-1 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                초기화
              </button>
            )}
          </form>

          {/* 액션 버튼들 */}
          <div className="flex gap-2">
            <button
              onClick={onRefresh}
              className="px-3 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              새로고침
            </button>
            <button
              onClick={onCreateRoom}
              className="px-3 py-1 text-sm bg-purple-500 text-white rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              방 생성
            </button>
          </div>
        </div>
      </div>

      {/* 채팅방 목록 */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500">로딩 중...</div>
          </div>
        ) : chatRooms.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500">채팅방이 없습니다.</div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {chatRooms.map((room) => (
              <div
                key={room._id}
                onClick={() => onRoomSelect(room)}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedRoom?._id === room._id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900">{room.name}</h3>
                  <div className="flex gap-1">
                    {room.isTeamMode && (
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">팀전</span>
                    )}
                    {room.isItemMode && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">아이템전</span>
                    )}
                    {room.isRankMode && (
                      <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">랭크전</span>
                    )}
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 space-y-1">
                  <div>생성자: {room.creator?.kakaoId || '알 수 없음'}</div>
                  <div>참가자: {room.participants?.length || 0}명</div>
                  <div>배심원: {room.jurors || 0}명</div>
                </div>
                
                <div className="text-xs text-gray-400 mt-2">
                  {new Date(room.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatRoomList; 