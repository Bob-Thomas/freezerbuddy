import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  async takePhoto(): Promise<string> {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    });

    if (image.dataUrl) {
      return image.dataUrl;
    }
    throw new Error('Failed to capture image');
  }

  async selectPhoto(): Promise<string> {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos
    });

    if (image.dataUrl) {
      return image.dataUrl;
    }
    throw new Error('Failed to select image');
  }
} 