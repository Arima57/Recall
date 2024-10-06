export declare type Base64String = string;
export interface RecordingData {
    value: {
        recordDataBase64: Base64String;
        msDuration: number;
        mimeType: string;
    };
}
export interface GenericResponse {
    value: boolean;
}
export declare const RecordingStatus: {
    readonly RECORDING: "RECORDING";
    readonly PAUSED: "PAUSED";
    readonly NONE: "NONE";
};
export interface CurrentRecordingStatus {
    status: (typeof RecordingStatus)[keyof typeof RecordingStatus];
}
export interface VoiceRecorderPlugin {
    canDeviceVoiceRecord(): Promise<GenericResponse>;
    requestAudioRecordingPermission(): Promise<GenericResponse>;
    hasAudioRecordingPermission(): Promise<GenericResponse>;
    startRecording(): Promise<GenericResponse>;
    stopRecording(): Promise<RecordingData>;
    pauseRecording(): Promise<GenericResponse>;
    resumeRecording(): Promise<GenericResponse>;
    getCurrentStatus(): Promise<CurrentRecordingStatus>;
}
