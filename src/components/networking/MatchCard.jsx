import React from 'react';
import PropTypes from 'prop-types';

const MatchCard = ({ onJoinVideo }) => {
    const matches = [
        {
            id: 1,
            name: 'John Smith',
            title: 'HR Manager',
            company: 'TCS',
            avatar: '👨‍💼'
        },
        {
            id: 2,
            name: 'Sarah Johnson',
            title: 'Tech Recruiter',
            company: 'IBM',
            avatar: '👩‍💻'
        },
        {
            id: 3,
            name: 'Mike Davis',
            title: 'Engineering Lead',
            company: 'Google',
            avatar: '👨‍🔬'
        }
    ];

    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">💡 Smart Matches</h2>
            <p className="text-gray-600 mb-6">People you should connect with based on your profile and interests.</p>

            <div className="space-y-4">
                {matches.map((match) => (
                    <div key={match.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-xl">
                                {match.avatar}
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">{match.name}</h3>
                                <p className="text-sm text-gray-600">{match.title} at {match.company}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                                💬 Chat
                            </button>
                            <button
                                onClick={() => onJoinVideo(match.company)}
                                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                            >
                                📹 Video
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

MatchCard.propTypes = {
    onJoinVideo: PropTypes.func.isRequired,
};

export default MatchCard;