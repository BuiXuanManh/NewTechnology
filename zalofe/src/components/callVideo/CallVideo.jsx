import React, { useState, useEffect } from 'react';
import './style.css';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { IonIcon } from '@ionic/react';
import { CloseOutlined } from '@mui/icons-material';

const CallVideo = ({ name, handleClose }) => {
    const [client] = useState(() => AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' }));
    const [config, setConfig] = useState({
        appid: 'a4a08025b4c2430e8c2028952579050c',
        token: '007eJxTYLjKsSEkz2xbs47t8eMFm/wmVklGcC9+c/Dr2t+5j9z5xc0VGBJNEg0sDIxMk0ySjUyMDVItko0MjCwsTY1MzS0NTA2SGRjc0xoCGRkUbr1kYWSAQBCfg6EsM7UkOSOxhIEBAHhXHyk=',
        uid: name,
        channel: 'vietchat',
    });
    const [localTracks, setLocalTracks] = useState({
        audioTrack: null,
        videoTrack: null,
    });
    const [localTrackState, setLocalTrackState] = useState({
        audioTrackMuted: false,
        videoTrackMuted: false,
    });
    const [remoteTracks, setRemoteTracks] = useState({});

    useEffect(() => {
        client.on("user-published", handleUserJoined);
        client.on("user-left", handleUserLeft);
        client.enableAudioVolumeIndicator();
        client.on("volume-indicator", handleVolumeIndicator);

        return () => {
            client.off("user-published", handleUserJoined);
            client.off("user-left", handleUserLeft);
            client.off("volume-indicator", handleVolumeIndicator);
        };
    }, [client]);

    const joinStreams = async () => {
        try {
            const [uid, audioTrack, videoTrack] = await Promise.all([
                client.join(config.appid, config.channel, config.token, config.uid),
                AgoraRTC.createMicrophoneAudioTrack(),
                AgoraRTC.createCameraVideoTrack(),
            ]);

            setConfig((prev) => ({ ...prev, uid }));
            setLocalTracks({ audioTrack, videoTrack });

            const player = `
                <div class="video-containers" id="video-wrapper-${uid}">
                    <p class="user-uid">
                        <img class="volume-icon" id="volume-${uid}" src="/assets/volume-on.svg" /> ${uid}
                    </p>
                    <div class="video-player player" id="stream-${uid}"></div>
                </div>`;

            document.getElementById('user-streams').insertAdjacentHTML('beforeend', player);
            videoTrack.play(`stream-${uid}`);
            await client.publish([audioTrack, videoTrack]);
        } catch (error) {
            console.error("Failed to join streams", error);
        }
    };

    const handleUserJoined = async (user, mediaType) => {
        setRemoteTracks((prev) => ({ ...prev, [user.uid]: user }));
        await client.subscribe(user, mediaType);

        if (mediaType === 'video') {
            const player = document.getElementById(`video-wrapper-${user.uid}`);
            if (player) {
                player.remove();
            }
            const newPlayer = `
                <div class="video-containers" id="video-wrapper-${user.uid}">
                    <p class="user-uid">
                        <img class="volume-icon" id="volume-${user.uid}" src="/assets/volume-on.svg" /> ${user.uid}
                    </p>
                    <div class="video-player player" id="stream-${user.uid}"></div>
                </div>`;
            document.getElementById('user-streams').insertAdjacentHTML('beforeend', newPlayer);
            user.videoTrack.play(`stream-${user.uid}`);
        }

        if (mediaType === 'audio') {
            user.audioTrack.play();
        }
    };

    const handleUserLeft = (user) => {
        setRemoteTracks((prev) => {
            const newTracks = { ...prev };
            delete newTracks[user.uid];
            return newTracks;
        });
        document.getElementById(`video-wrapper-${user.uid}`).remove();
    };

    const handleVolumeIndicator = (evt) => {
        evt.forEach(({ uid, level }) => {
            const volumeIcon = document.getElementById(`volume-${uid}`);
            if (volumeIcon) {
                volumeIcon.src = level > 0 ? '/assets/volume-on.svg' : '/assets/volume-off.svg';
            }
        });
    };

    const handleJoinClick = async () => {
        await joinStreams();
        document.getElementById('join-wrapper').style.display = 'none';
        document.getElementById('footer').style.display = 'flex';
    };

    const handleMicClick = async () => {
        if (!localTrackState.audioTrackMuted) {
            await localTracks.audioTrack.setMuted(true);
            setLocalTrackState((prev) => ({ ...prev, audioTrackMuted: true }));
            document.getElementById('mic-btn').style.backgroundColor = 'rgb(255, 80, 80, 0.7)';
        } else {
            await localTracks.audioTrack.setMuted(false);
            setLocalTrackState((prev) => ({ ...prev, audioTrackMuted: false }));
            document.getElementById('mic-btn').style.backgroundColor = '#1f1f1f8e';
        }
    };

    const handleCameraClick = async () => {
        if (!localTrackState.videoTrackMuted) {
            await localTracks.videoTrack.setMuted(true);
            setLocalTrackState((prev) => ({ ...prev, videoTrackMuted: true }));
            document.getElementById('camera-btn').style.backgroundColor = 'rgb(255, 80, 80, 0.7)';
        } else {
            await localTracks.videoTrack.setMuted(false);
            setLocalTrackState((prev) => ({ ...prev, videoTrackMuted: false }));
            document.getElementById('camera-btn').style.backgroundColor = '#1f1f1f8e';
        }
    };

    const handleLeaveClick = async () => {
        for (const trackName in localTracks) {
            const track = localTracks[trackName];
            if (track) {
                track.stop();
                track.close();
                setLocalTracks((prev) => ({ ...prev, [trackName]: null }));
            }
        }
        await client.leave();
        document.getElementById('footer').style.display = 'none';
        document.getElementById('user-streams').innerHTML = '';
        document.getElementById('join-wrapper').style.display = 'block';
    };

    return (
        <>
            <div className="body fixed mx-[35%] h-[47%] top-0 mt-[7%] bg-[#00665] z-50 flex">
                <div className="main bg-[#00665] text-white">
                    <div className="flex justify-between">
                        <h1 id="site-title">Ivy Streams</h1>
                        <div onClick={() => handleClose()}>
                            <IonIcon icon={CloseOutlined} />
                        </div>
                    </div>

                    <div id="join-wrapper">
                        <button id="join-btn" onClick={() => handleJoinClick()}>Join Stream</button>
                    </div>
                    <div id="user-streams"></div>
                    <div id="footer" style={{ display: 'none' }}>
                        <div className="icon-wrapper" onClick={() => handleCameraClick()}>
                            <img className="control-icon" id="camera-btn" src="/assets/video.svg" />
                            <p>Cam</p>
                        </div>
                        <div className="icon-wrapper" onClick={() => handleMicClick()}>
                            <img className="control-icon" id="mic-btn" src="/assets/microphone.svg" />
                            <p>Mic</p>
                        </div>
                        <div className="icon-wrapper" onClick={() => handleLeaveClick()}>
                            <img className="control-icon" id="leave-btn" src="/assets/leave.svg" />
                            <p>Leave</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
    );
};

export default CallVideo;

