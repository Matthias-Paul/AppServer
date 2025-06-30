import ffmpeg from 'fluent-ffmpeg'
import ffmpegPath from 'ffmpeg-static'
import ffprobeInstaller from '@ffprobe-installer/ffprobe'

ffmpeg.setFfmpegPath(ffmpegPath)

// Set the path to ffprobe binary
ffmpeg.setFfprobePath(ffprobeInstaller.path)


export const getMediaDuration = (filePath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) return reject(err)

      const durationInSeconds = metadata.format.duration
      const minutes = Math.floor(durationInSeconds / 60)
      const seconds = Math.floor(durationInSeconds % 60)

      const formattedDuration = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
      resolve(formattedDuration)
    })
  })
}
