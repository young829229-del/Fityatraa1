import https from 'https';

const urls = [
  "https://ibb.co/DnpgqnK", "https://ibb.co/9H3tZxXd", "https://ibb.co/nGrff6X",
  "https://ibb.co/pDBP2mj", "https://ibb.co/yngLc8BS", "https://ibb.co/tTV9hnmb",
  "https://ibb.co/BVbNcmqD", "https://ibb.co/cKRwSvPw", "https://ibb.co/Y4jCxPqc",
  "https://ibb.co/whXTSPxD", "https://ibb.co/yFY7vRXJ", "https://ibb.co/yFtk503J",
  "https://ibb.co/FLYYVvCN", "https://ibb.co/wZMkXh1j", "https://ibb.co/XxQnw8gW",
  "https://ibb.co/mVDYmMKD", "https://ibb.co/pB8xtqXp", "https://ibb.co/Jw1722WJ",
  "https://ibb.co/TMgcszdp", "https://ibb.co/dwwwMjnC", "https://ibb.co/0pKxfRqT",
  "https://ibb.co/Ps1gNQn7", "https://ibb.co/yn5yTSMq", "https://ibb.co/Gwwd2kF",
  "https://ibb.co/QjvhTF67", "https://ibb.co/p9mGy2g", "https://ibb.co/7xp8fzdd",
  "https://ibb.co/LzxnvDmd", "https://ibb.co/6RCSMh63", "https://ibb.co/mrxQH2JJ",
  "https://ibb.co/5XDbCf8q", "https://ibb.co/LdfBTp0h", "https://ibb.co/nqNfWSdm",
  "https://ibb.co/QvCJFFPp", "https://ibb.co/nsyP9hVq", "https://ibb.co/VG8s2GZ"
];

for (const url of urls) {
  https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const match = data.match(/<link rel="image_src" href="(.*?)"/);
      if (match) console.log(url + ' -> ' + match[1]);
    });
  });
}
