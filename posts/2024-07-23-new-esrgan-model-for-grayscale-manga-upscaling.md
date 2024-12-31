`---
title: "New ESRGAN model for grayscale manga upscaling"
datetime: "2024-07-23"
thumbnail: "https://i.imgur.com/hIfdgyn.png"
summary: "A customized ESRGAN model trained with my own dataset. It works perfectly for 1200px-height grayscale images."
---
A customized ESRGAN model trained with my own dataset. It works perfectly for 1200px-height grayscale images.
\
After some consideration, I decided to stick with **ESRGAN** due to its popularity and efficiency relative to the quality it delivers. For this round of training, I manually generated the low-quality images with more supervision compared to the previous attempt. Most importantly, I specifically trained this model for 1200px images.
\
![comparison](https://i.imgur.com/GaRKrvD.png)
_(Before and after upscaling with ESRGAN, customized model for grayscale manga.)_
\
**Summary of the process:**
\
The dataset was made with **200 high-quality selective images** (4800px - target resolution that we intend to upscale images to) which had a lot of screentone details and noisy backgrounds. To create low-quality data for training, these images were then **downscaled to 25% of their original sizes** (to 1200px) using bicubic (similar to resizing method on Photoshop). Then, they were randomly **blurred** and subjected to a **JPEG artifacts**. The resulting low-quality images are **similar to the typical raw quality on Rawkuma**.
\
By supervising the low-quality images generating process, the model is better at **arranging screentone dots** and **retaining noise** (in some situation, it's the best to keep it noisy) in many cases where it has been trained on it. 
\
![sample_hq_1](https://i.imgur.com/1ft7LhT.png)
![sample_hq_2](https://i.imgur.com/jpc1EMc.png)
_(Sample of high-quality images used for training. Please note that these are large images, for showcase purpose only. In preparation for training, they have to be cropped into multiple tiles of 400px.)_
\
The total training time was about **6 hours**, includes two stages, to enhance details and ensure better handling of areas where manga lines and screentones overlap.
\
**General Information:**
Model name: **4x_ChiseliasMangaSR_ESRGAN_1200px**

Architecture: **Real-ESRGAN**

Number of training samples: **33,000 images** (400x400px)

Purpose: Sharpening manga pages and **restoring screentones**/noise

Best used for: 1200px images

Image sources: Selected from 4 manga series, which are _The Ancient Magus' Bride; How to Make a "Girl" Fall in Love; And Yet, You Are So Sweet; Whisper Me a Love Song_
\
\
Download link for the model:
**[CLICK HERE](https://drive.google.com/drive/u/1/folders/1dEhPIBBLVzZ_CmjKrgMJGWGXC8hhFUvT)**
