import { Component } from '@angular/core';
interface Item{
  imageSrc: string;
  imageAlt: string;
  category: string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'image-gallery';

  private generateAnnieWeddingImages(count: number): Item[] {
    return Array.from({ length: count }, (_, i) => ({
      imageSrc: `../assets/images/AnitasWedding/1 (${i + 1}).jpg`,
      imageAlt: `${i + 1}`,
      category: "Anita's Wedding"
    }));
  }

  private generateAbhijeetWeddingImages(count: number): Item[] {
    return Array.from({ length: count }, (_, i) => ({
      imageSrc: `../assets/images/AvijeetWedding/2 (${i + 1}).jpg`,
      imageAlt: `${i + 1}`,
      category: "Avijeet's Wedding"
    }));
  }

  private generateSelfieImages(count: number): Item[] {
    return Array.from({ length: count }, (_, i) => ({
      imageSrc: `../assets/images/Selfie/3 (${i + 1}).jpg`,
      imageAlt: `Selfie ${i + 1}`,
      category: "Selfies"
    }));
  }

  data: Item[] = [
    ...this.generateAnnieWeddingImages(67),  // Generate 67 wedding images
    ...this.generateAbhijeetWeddingImages(16),  // Generate 67 wedding images
    ...this.generateSelfieImages(65),  // Adjust the number based on your actual selfie count
  ];
}
