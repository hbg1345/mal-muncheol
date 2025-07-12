import React, { useState } from 'react';

const CreateRoomModal = ({ isOpen, onClose, onCreateRoom }) => {
  const [formData, setFormData] = useState({
    name: '',
    isTeamMode: false,
    isItemMode: false,
    isRankMode: false,
    maxParticipants: 10
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('채팅방 이름을 입력해주세요.');
      return;
    }
    onCreateRoom(formData);
    setFormData({
      name: '',
      isTeamMode: false,
      isItemMode: false,
      isRankMode: false,
      maxParticipants: 10
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">새 채팅방 생성</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 채팅방 이름 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              채팅방 이름 *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="채팅방 이름을 입력하세요"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* 최대 참가자 수 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              최대 참가자 수
            </label>
            <select
              name="maxParticipants"
              value={formData.maxParticipants}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5명</option>
              <option value={10}>10명</option>
              <option value={15}>15명</option>
              <option value={20}>20명</option>
            </select>
          </div>

          {/* 게임 설정 */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700">게임 설정</h3>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isTeamMode"
                checked={formData.isTeamMode}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">
                팀전 모드
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isItemMode"
                checked={formData.isItemMode}
                onChange={handleChange}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">
                아이템전 모드
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isRankMode"
                checked={formData.isRankMode}
                onChange={handleChange}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">
                랭크전 모드
              </label>
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              생성
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRoomModal; 