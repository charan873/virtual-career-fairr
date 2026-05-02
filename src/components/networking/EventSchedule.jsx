import React from 'react';

const EventSchedule = () => {
    const events = [
        { id: 1, title: 'Keynote Speech', time: '10:00 AM - 11:00 AM', speaker: 'John Doe', type: 'presentation' },
        { id: 2, title: 'Networking Session', time: '11:30 AM - 12:30 PM', speaker: 'Jane Smith', type: 'networking' },
        { id: 3, title: 'Workshop: Resume Building', time: '1:00 PM - 2:30 PM', speaker: 'Emily Johnson', type: 'workshop' },
        { id: 4, title: 'Panel Discussion: Industry Trends', time: '3:00 PM - 4:00 PM', speaker: 'Michael Brown', type: 'panel' },
    ];

    const getEventIcon = (type) => {
        switch (type) {
            case 'presentation': return '🎤';
            case 'networking': return '🤝';
            case 'workshop': return '🛠️';
            case 'panel': return '👥';
            default: return '📅';
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">📅 Today's Schedule</h2>
            <p className="text-gray-600 mb-6">Upcoming events and networking opportunities.</p>

            <div className="space-y-4">
                {events.map(event => (
                    <div key={event.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl">{getEventIcon(event.type)}</div>
                        <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{event.title}</h3>
                            <p className="text-sm text-blue-600 font-medium">{event.time}</p>
                            <p className="text-sm text-gray-600">Speaker: {event.speaker}</p>
                        </div>
                        <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                            Join
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EventSchedule;