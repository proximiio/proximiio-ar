export declare function browserHasImmersiveArCompatibility(): Promise<boolean>;
export declare function displayUnsupportedBrowserMessage(): void;
/**
 * Create and show a simple introduction message if the device supports
 * WebXR with immersive-ar mode.
 */
export declare function displayIntroductionMessage(): () => void;
declare const InjectCSS: ({ id, css }: {
    id: string;
    css: string;
}) => void;
declare const _default: {
    browserHasImmersiveArCompatibility: typeof browserHasImmersiveArCompatibility;
    displayIntroductionMessage: typeof displayIntroductionMessage;
    displayUnsupportedBrowserMessage: typeof displayUnsupportedBrowserMessage;
};
export default _default;
export { InjectCSS };
