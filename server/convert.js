import fs from "fs";
import wav from "node-wav";
import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from 'ffmpeg-static';
import { resolve } from "path";


const filePath = "./tmp/audio.mp4";
const outputPath = filePath.replace(".mp4", ".wav");

export const convert = () => new Promise((resolve, reject)=> {
   console.log("Convertendo o video")

    ffmpeg.setFfmpegPath(ffmpegStatic);
      ffmpeg()
        .input(filePath)
        .audioFrequency(16000)
        .audioChannels(1)
        .format("wav")
        .on("end", () => {
          const file = fs.readFileSync(outputPath);
          const fileDecoded = wav.decode(file);

          const audioData = fileDecoded.channelData[0];
          const floatArray = new Float32Array(audioData);

          console.log("Vídeo convertido com sucesso");

          // Remover o arquivo de saída após a conclusão
          resolve(floatArray);
          fs.unlinkSync(outputPath);

        
        })
        .on("error", (error) => {
          console.error(`Erro ao converter o vídeo: ${error.message}`);
          reject(error);
        })
        .save(outputPath);
    })

  
