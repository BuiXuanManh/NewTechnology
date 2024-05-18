import React, { useState, useEffect } from 'react';
import './style.css';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { IonIcon } from '@ionic/react';
import { CloseOutlined } from '@mui/icons-material';
import { VideoPlayer } from './VideoPlayer';

const APP_ID = 'a4a08025b4c2430e8c2028952579050c';
const TOKEN = '007eJxTYOh5YPDE/uLqHpbj4kz8mh2J81mOzOW3tZm3y/mEs+KCTRcUGBJNEg0sDIxMk0ySjUyMDVItko0MjCwsTY1MzS0NTA2SryV4pDUEMjIEOmcyMjJAIIjPwVCWmVqSnJFYwsAAABwnHiw=';
const CHANNEL = 'vietchat';

const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

const CallVideo = ({ handleClose, id, name }) => {
    const [users, setUsers] = useState([]);
    const [localTracks, setLocalTracks] = useState([]);

    const handleUserJoined = async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        if (mediaType === 'video') {
            // Cập nhật tên hiển thị khi người dùng tham gia
            const existingUser = users.find(u => u.uid === user.uid);
            if (existingUser) {
                existingUser.name = user.name; // Đặt tên mới nếu có
            }

            setUsers(prevUsers => [...prevUsers, user]);
        }
    };
    const handleUserLeft = (user) => {
        setUsers((previousUsers) => previousUsers.filter((u) => u.uid !== user.uid));
    };

    useEffect(() => {
        const init = async () => {
            client.on('user-published', handleUserJoined);
            client.on('user-left', handleUserLeft);

            const uid = await client.join(APP_ID, CHANNEL, TOKEN, null);
            const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();

            setLocalTracks([audioTrack, videoTrack]);
            setUsers((previousUsers) => [
                ...previousUsers,
                { uid, name, id, videoTrack, audioTrack },
            ]);

            await client.publish([audioTrack, videoTrack]);
        };

        init();

        return () => {
            const cleanup = async () => {
                for (let track of localTracks) {
                    track.stop();
                    track.close();
                }
                client.off('user-published', handleUserJoined);
                client.off('user-left', handleUserLeft);

                if (localTracks.length > 0) {
                    await client.unpublish(localTracks);
                    await client.leave();
                }
            };

            cleanup();
        };
    }, [localTracks]);

    return (
        <>
            <div className="body fixed w-[50%] h-[80%] top-0 mt-[7%] bg-[#00665] !z-50 flex">
                <div className="main bg-[#00665] text-white">
                    <div className="flex justify-between">
                        <h1 id="site-title">Viet Chat</h1>
                        <div onClick={handleClose}>
                            <IonIcon icon={CloseOutlined} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 200px)' }}>
                            {users.map((user) => (
                                <div className='gap-2 '>
                                    <VideoPlayer key={user.uid} user={user} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
    );
};

export default CallVideo;
