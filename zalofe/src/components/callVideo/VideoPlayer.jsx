import React, { useEffect, useRef } from 'react';

export const VideoPlayer = ({ user }) => {
    const ref = useRef();

    useEffect(() => {
        if (user.videoTrack) {
            user.videoTrack.play(ref.current);
        }

        return () => {
            if (user.videoTrack) {
                user.videoTrack.stop();
            }
        };
    }, [user.videoTrack]); // Chỉ chạy lại effect khi videoTrack thay đổi

    return (
        <div className="video-player">
            <div ref={ref} style={{ width: '200px', height: '200px' }} />
            <div className="user-info"> {/* Thêm phần hiển thị thông tin người dùng */}
                <p>Name: {user.name}</p>
                <p>UID: {user.uid}</p>
            </div>
        </div>
    );
};