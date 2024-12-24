`---
title: "How to download raw images from Bookwalker JP"
datetime: "2023-03-29"
thumbnail: "https://i.imgur.com/jll4YRC.jpeg"
summary: "An alternative way to download purchased raws from Bookwalker JP. Works all the time!"
---
_(Please note that this is applied for **bookwalker.jp** only)_
\
Earlier tonight, I noticed someone encountered a cookies error while using a tool to download from Bookwalker. So I want to share with everyone an alternative way to download purchased raws from Bookwalker JP. This method isn’t particularly fast, especially for those unfamiliar with tinkering around, but I find the tool is updated quite regularly and works stably as of now.
\
This method uses a modified version of **Chromium** by **_[@xuzhengyi1995](https://github.com/xuzhengyi1995)_** on GitHub. It might feel a bit complex for those who are familiar with using a 1-click tools.
\
**GitHub Link**: https://j2team.dev/go/5c94c56b
\
Currently, it’s at version 0.3.3, but I recommend downloading version 0.3.2 because the latest version has some bugs.
**Download v0.3.2 here:** https://j2c.cc/bwdl032
\
**Steps:**

**1.** After extracting the files, open the chrome.exe file in the extracted folder via cmd using the command below.

```
.\chrome.exe --user-data-dir=c:\bw-downloader-profile --no-sandbox
```
\
_Alternatively, you can create a **.bat** file to easily open later.
To create the **.bat** file:
Open **Notepad** and paste the command above.
Save it as a **.bat** file (you can name it anything you like) in the same folder where you extracted the files.
For those already familiar with this process, feel free to skip these steps. This is just for those who don’t know how to use cmd. Once done, simply double-click the .bat file to launch the modified Chromium._
\
![image1](https://i.imgur.com/Mygqy8u.png)
\
**2.** After launching, log in to your Bookwalker account, select the book you want to read, and it will save automatically.
_**Recommendation:** Reset the reading progress of the book to 0% for better approaching._
\
**3.** Resize the browser window to display only one page at a time (as shown in the example image).
\
![image2](https://i.imgur.com/hAgD60h.png)
The image files will be saved to the path `C:\bw_export_data` in a folder named after the book's ID.
\
![image3](https://i.imgur.com/H56oqWn.png)
**4.** Manually flip through the pages to save each image.
\
**Optional:** If you want the process to run automatically, open the Console in Developer Tools, paste the following command, and press Enter:

```
window.i=0;setInterval(()=>{NFBR.a6G.Initializer.v9x.menu.options.a6l.moveToPage(window.i);console.log(window.i);window.i++;},3000)
```
\
This script will automatically flip through the pages every 3000 milliseconds (3 seconds). You can adjust the interval as needed. If you have a fast internet connection, you can set it to 2000 milliseconds for quicker processing.
\
I hope this guide is helpful 🙂