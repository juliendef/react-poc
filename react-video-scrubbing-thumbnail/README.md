# How to use project

```bash
npm install
```

Then, use

```bash
ffmpeg -i video.mp4 -vf "fps=1,scale=200:-1" thumbnails/thumb%04d.jpg
```

to generate thumbnails from a video file.

or for the sprite version, use the following to generate one file with all the thumbnails in a grid:

```bash
ffmpeg -i video.mp4 -vf "fps=1,scale=200:-1,tile=10x1" sprite.jpg
```

public folder structure should be

```
public
├── video.mp4
├── sprite.jpg
└── thumbnails
    ├── thumb0001.jpg
    ├── thumb0002.jpg
    ├── thumb0003.jpg
    ├── thumb0004.jpg
    ├── thumb0005.jpg
    ├── thumb0006.jpg
    ├── thumb0007.jpg
    ├── thumb0008.jpg
    ├── thumb0009.jpg
    └── thumb0010.jpg
```
