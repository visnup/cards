const fs = require('fs');
const sharp = require('sharp');

const compressImages = async () => {
  const allDirs = fs.readdirSync('./dist/cards');

  const allPromises = allDirs
    .map((dir) => {
      const allLocales = fs.readdirSync(`./dist/cards/${dir}`);

      return allLocales.map((loc) => {
        const allLocaleFiles = fs
          .readdirSync(`./dist/cards/${dir}/${loc}`)
          .filter((f) => f.includes('.png'));

        return allLocaleFiles.map((file) => [
          sharp(`./dist/cards/${dir}/${loc}/${file}`)
            .avif({
              quality: 20,
              lossless: true,
            })
            .toFile(
              `./dist/cards/${dir}/${loc}/${file.replace('.png', '.avif')}`,
            ),

          sharp(`./dist/cards/${dir}/${loc}/${file}`)
            .webp({
              quality: 20,
              lossless: true,
            })
            .toFile(
              `./dist/cards/${dir}/${loc}/${file.replace('.png', '.webp')}`,
            ),
        ]);
      });
    })
    .flat(Infinity);

  await Promise.all(allPromises);
  console.log('Compressed images!');
};

compressImages();
