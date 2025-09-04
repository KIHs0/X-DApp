import React from 'react'

export const Pn = ({ address, setshowpanel }) => {
    return (
        <div className="fixed top-0 right-0 w-80 h-full bg-gray-800 shadow-lg p-4">
            <h2 className="text-lg font-bold mb-4 ">{address ? `🚹Profile` : `🔔Notification`}</h2>
            {address ? <p className="text-gray-400 top-1/2 absolute left-4/16    whitespace-pre">connected ${address}</p> :
                <p className="text-gray-400 top-1/2 absolute left-4/12 ">{address ? `connected ${address}` : `No notifications`}</p>
            }
            <button
                onClick={() => setshowpanel(false)}
                className="mt-4 px-2 py-2 bg-cyan-600 rounded-lg top-0 right-2 absolute hover:bg-cyan-700"
            >
                ❌
            </button>
        </div>
    )
}