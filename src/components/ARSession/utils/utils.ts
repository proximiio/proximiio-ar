const rad2deg = 180.0 / Math.PI;
const deg2rad = Math.PI / 180;

function onFrame(
	frameTickFn: (timestamp: number) => Promise<boolean>,
	fps: number = 30
): void {
	const fpsInterval: number = Math.floor(1000 / fps);

	let t1: number = performance.now();

	const onAnimationFrame = async (): Promise<void> => {
		const t2: number = performance.now();
		const elapsedTime: number = t2 - t1;

		if (elapsedTime > fpsInterval) {
			t1 = t2 - (elapsedTime % fpsInterval);

			if ((await frameTickFn(t2)) === false) {
				return;
			}
		}

		requestAnimationFrame(onAnimationFrame);
	};

	requestAnimationFrame(onAnimationFrame);
}

function isIOS() {
	return /iPad|iPhone|iPod/.test(navigator.platform);
}

function isMobile() {
	try {
		document.createEvent('TouchEvent');
		return true;
	} catch (e) {
		return false;
	}
}

function getScreenOrientation() {
	let angle = -1;

	if (window.screen && window.screen.orientation) {
		angle = window.screen.orientation.angle;
	} else if ('orientation' in window) {
		angle = window.orientation;
	}

	switch (angle) {
		case 0:
			return 'portrait';
		case 90:
			return 'landscape_left';
		case 180:
			return 'portrait';
		case 270:
			return 'landscape_right';
		case -90:
			return 'landscape_right';
	}

	return 'unknown';
}

interface Rect {
	width: number;
	height: number;
	x: number;
	y: number;
}

function resize2cover(
	srcW: number,
	srcH: number,
	dstW: number,
	dstH: number
): Rect {
	const rect: Rect = {
		width: 0,
		height: 0,
		x: 0,
		y: 0,
	};

	if (dstW / dstH > srcW / srcH) {
		const scale: number = dstW / srcW;
		rect.width = Math.floor(scale * srcW);
		rect.height = Math.floor(scale * srcH);
		rect.x = 0;
		rect.y = Math.floor((dstH - rect.height) * 0.5);
	} else {
		const scale: number = dstH / srcH;
		rect.width = Math.floor(scale * srcW);
		rect.height = Math.floor(scale * srcH);
		rect.x = Math.floor((dstW - rect.width) * 0.5);
		rect.y = 0;
	}

	return rect;
}

function createCanvas(width: number, height: number): HTMLCanvasElement {
	const canvas: HTMLCanvasElement = document.createElement('canvas');

	canvas.width = width;
	canvas.height = height;

	return canvas;
}

class Camera {
	el: HTMLVideoElement;
	width: number;
	height: number;
	_canvas: HTMLCanvasElement;
	_ctx: CanvasRenderingContext2D;

	static async Initialize(
		constraints: MediaStreamConstraints | null = null
	): Promise<Camera> {
		if (
			constraints &&
			'facingMode' in constraints &&
			'deviceId' in constraints
		) {
			throw new Error(
				`Camera settings 'deviceId' and 'facingMode' are mutually exclusive.`
			);
		}

		if (
			constraints &&
			'facingMode' in constraints &&
			!['environment', 'user'].includes(constraints.facingMode as string)
		) {
			throw new Error(
				`Camera settings 'facingMode' can only be 'environment' or 'user'.`
			);
		}

		const setupUserMediaStream = (permission: PermissionStatus | undefined) => {
			return new Promise<Camera>((resolve, reject) => {
				const onSuccess = (stream: MediaStream) => {
					const track = stream.getVideoTracks()[0];

					if (!track) {
						reject(
							new Error(
								`Failed to access camera: Permission denied (No track).`
							)
						);
					} else {
						const video = document.createElement('video');

						video.setAttribute('autoplay', 'autoplay');
						video.setAttribute('playsinline', 'playsinline');
						video.setAttribute('webkit-playsinline', 'webkit-playsinline');
						video.srcObject = stream;

						video.onloadedmetadata = () => {
							const settings = track.getSettings();

							const tw = settings.width || 0;
							const th = settings.height || 0;
							const vw = video.videoWidth;
							const vh = video.videoHeight;

							if (vw !== tw || vh !== th) {
								console.warn(
									`Video dimensions mismatch: width: ${tw}/${vw}, height: ${th}/${vh}`
								);
							}

							video.style.width = vw + 'px';
							video.style.height = vh + 'px';
							video.width = vw;
							video.height = vh;
							video.play();

							resolve(new Camera(video));
						};
					}
				};

				const onFailure = (error: MediaStreamError) => {
					switch (error.name) {
						case 'NotFoundError':
						case 'DevicesNotFoundError':
							reject(new Error(`Failed to access camera: Camera not found.`));
							return;
						case 'SourceUnavailableError':
							reject(new Error(`Failed to access camera: Camera busy.`));
							return;
						case 'PermissionDeniedError':
						case 'SecurityError':
							reject(new Error(`Failed to access camera: Permission denied.`));
							return;
						default:
							reject(new Error(`Failed to access camera: Rejected.`));
							return;
					}
				};

				if (permission && permission.state === 'denied') {
					reject(new Error(`Failed to access camera: Permission denied.`));
					return;
				}

				navigator.mediaDevices
					.getUserMedia(constraints as MediaStreamConstraints)
					.then(onSuccess)
					.catch(onFailure);
			});
		};

		if (navigator.permissions && navigator.permissions.query) {
			return navigator.permissions
				.query({ name: 'camera' as PermissionName })
				.then((permission) => {
					return setupUserMediaStream(permission);
				})
				.catch(() => {
					return setupUserMediaStream(undefined);
				});
		} else {
			return setupUserMediaStream(undefined);
		}
	}

	constructor(videoElement: HTMLVideoElement) {
		this.el = videoElement;
		this.width = videoElement.videoWidth;
		this.height = videoElement.videoHeight;

		this._canvas = createCanvas(this.width, this.height);
		this._ctx = this._canvas.getContext('2d')!;
	}

	getImageData(): ImageData {
		this._ctx.clearRect(0, 0, this.width, this.height);
		this._ctx.drawImage(this.el, 0, 0, this.width, this.height);

		return this._ctx.getImageData(0, 0, this.width, this.height);
	}
}

class Video {
	el: HTMLVideoElement;
	width: number;
	height: number;
	_canvas: HTMLCanvasElement;
	_ctx: CanvasRenderingContext2D;
	_lastTime: number | null;
	_imageData: ImageData | null;

	static async Initialize(url: string, timeout: number = 8000): Promise<Video> {
		return new Promise<Video>((resolve, reject) => {
			let tid: ReturnType<typeof setTimeout>;

			const video = document.createElement('video');

			video.src = url;
			video.setAttribute('autoplay', 'autoplay');
			video.setAttribute('playsinline', 'playsinline');
			video.setAttribute('webkit-playsinline', 'webkit-playsinline');
			video.autoplay = true;
			video.muted = true;
			video.loop = true;
			video.load();

			tid = setTimeout(() => {
				reject(
					new Error(`Failed to load video: Timed out after ${timeout}ms.`)
				);
			}, timeout);

			video.onerror = () => {
				clearTimeout(tid);
				reject(new Error(`Failed to load video.`));
			};

			video.onabort = () => {
				clearTimeout(tid);
				reject(new Error(`Failed to load video: Load aborted.`));
			};

			if (video.readyState >= 4) {
				clearTimeout(tid);
				resolve(new Video(video));
			} else {
				video.oncanplaythrough = () => {
					clearTimeout(tid);
					if (video.videoWidth === 0 || video.videoHeight === 0) {
						reject(new Error(`Failed to load video: Invalid dimensions.`));
					} else {
						resolve(new Video(video));
					}
				};
			}
		});
	}

	constructor(videoElement: HTMLVideoElement) {
		this.el = videoElement;
		this.width = videoElement.videoWidth;
		this.height = videoElement.videoHeight;

		this._canvas = createCanvas(this.width, this.height);
		this._ctx = this._canvas.getContext('2d')!;
		this._lastTime = null;
		this._imageData = null;
	}

	getImageData(): ImageData {
		const t = this.el.currentTime;

		if (this._lastTime !== t) {
			this._lastTime = t;
			this._imageData = null;
		}

		if (this._imageData === null) {
			this._ctx.clearRect(0, 0, this.width, this.height);
			this._ctx.drawImage(this.el, 0, 0, this.width, this.height);
			this._imageData = this._ctx.getImageData(0, 0, this.width, this.height);
		}

		return this._imageData;
	}
}

export {
	Camera,
	Video,
	onFrame,
	isMobile,
	isIOS,
	getScreenOrientation,
	resize2cover,
	rad2deg,
	deg2rad,
	createCanvas,
};
