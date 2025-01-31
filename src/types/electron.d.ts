export interface ElectronMediaConstraints {
  audio: boolean | MediaTrackConstraints;
  video:
    | boolean
    | (MediaTrackConstraints & {
        mandatory?: {
          chromeMediaSource: string;
          chromeMediaSourceId: string;
          minWidth: number;
          maxWidth: number;
          minHeight: number;
          maxHeight: number;
          frameRate: number;
        };
      });
}
