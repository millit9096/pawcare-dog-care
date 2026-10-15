import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const gradlePath = path.resolve('android/app/build.gradle');
let gradle = await readFile(gradlePath, 'utf8');
if (!gradle.includes('signingConfigs {')) {
  gradle = gradle.replace(/android\s*\{/, `android {
    signingConfigs {
        release {
            storeFile file(System.getenv('ANDROID_KEYSTORE_PATH'))
            storePassword System.getenv('ANDROID_KEYSTORE_PASSWORD')
            keyAlias System.getenv('ANDROID_KEY_ALIAS')
            keyPassword System.getenv('ANDROID_KEY_PASSWORD')
        }
    }`);
}
if (!gradle.includes('signingConfig signingConfigs.release')) {
  const releaseBlock = /buildTypes\s*\{\s*release\s*\{/;
  if (!releaseBlock.test(gradle)) throw new Error('Capacitor generated Android release build type was not found.');
  gradle = gradle.replace(releaseBlock, match => `${match}\n            signingConfig signingConfigs.release`);
}
gradle = gradle.replace(/versionCode\s+\d+/, `versionCode ${Number(process.env.GITHUB_RUN_NUMBER) || 1}`);
await writeFile(gradlePath, gradle);

