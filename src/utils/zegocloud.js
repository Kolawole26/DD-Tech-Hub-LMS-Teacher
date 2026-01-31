// utils/zegocloud.js
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

// Get credentials from environment variables
export const APP_ID = parseInt(process.env.NEXT_PUBLIC_ZEGOCLOUD_APP_ID) || 0;
export const SERVER_SECRET = process.env.NEXT_PUBLIC_ZEGOCLOUD_SERVER_SECRET || '';

// Generate unique user ID
export const generateUserID = () => {
  return Date.now().toString() + Math.floor(Math.random() * 10000).toString();
};

// Generate room ID
export const generateRoomID = () => {
  return 'room_' + Date.now().toString();
};

// Generate Kit Token for authentication
export const generateKitToken = (roomID, userID) => {
  if (!APP_ID || !SERVER_SECRET) {
    console.error('ZEGOCLOUD credentials not configured. Please check your .env.local file.');
    return '';
  }

  return ZegoUIKitPrebuilt.generateKitTokenForTest(
    APP_ID,
    SERVER_SECRET,
    roomID,
    userID,
    'Instructor_' + userID
  );
};

// Initialize ZEGOCLOUD for live session
export const initializeZegoCloud = async (containerElement, roomID, userID, userName, options = {}) => {
  try {
    const kitToken = generateKitToken(roomID, userID);
    
    if (!kitToken) {
      throw new Error('Failed to generate Kit Token. Check your ZEGOCLOUD credentials.');
    }

    const zc = ZegoUIKitPrebuilt.create(kitToken);

    // Configure the meeting
    await zc.joinRoom({
      container: containerElement,
      scenario: {
        mode: ZegoUIKitPrebuilt.VideoConference, // or ZegoUIKitPrebuilt.OneONoneCall
      },
      turnOnMicrophoneWhenJoining: options.microphone !== false,
      turnOnCameraWhenJoining: options.camera !== false,
      showMyCameraToggleButton: true,
      showMyMicrophoneToggleButton: true,
      showAudioVideoSettingsButton: true,
      showScreenSharingButton: true,
      showTextChat: options.chat !== false,
      showUserList: true,
      maxUsers: options.maxUsers || 50,
      layout: options.layout || 'Auto', // 'Grid' or 'Sidebar'
      showLayoutButton: true,
      showNonVideoUser: true,
      showOnlyAudioUser: true,
      
      // Recording configuration
      showRecordingButton: options.recording !== false,
      
      // Branding
      branding: {
        logoURL: options.logoURL || '',
      },
      
      // Callbacks
      onJoinRoom: () => {
        console.log('Joined room successfully');
        if (options.onJoinRoom) options.onJoinRoom();
      },
      onLeaveRoom: () => {
        console.log('Left room');
        if (options.onLeaveRoom) options.onLeaveRoom();
      },
      onUserJoin: (users) => {
        console.log('Users joined:', users);
        if (options.onUserJoin) options.onUserJoin(users);
      },
      onUserLeave: (users) => {
        console.log('Users left:', users);
        if (options.onUserLeave) options.onUserLeave(users);
      },
    });

    return zc;
  } catch (error) {
    console.error('Error initializing ZEGOCLOUD:', error);
    throw error;
  }
};

// Leave and cleanup
export const leaveRoom = (zegoInstance) => {
  if (zegoInstance) {
    zegoInstance.destroy();
  }
};