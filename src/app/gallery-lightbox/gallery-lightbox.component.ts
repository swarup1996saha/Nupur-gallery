import { Component, Input, OnInit, HostListener } from '@angular/core';
import { animate, style, transition, trigger, AnimationEvent, stagger, query } from '@angular/animations';

interface Item {
  imageSrc: string;
  imageAlt: string;
  loaded?: boolean;
  category: string;  // Add category field
  description?: string;
  date?: string;
  likes?: number;
  views?: number;
  isFavorite?: boolean;
  dateAdded?: Date;
}

@Component({
  selector: 'app-gallery-lightbox',
  templateUrl: './gallery-lightbox.component.html',
  styleUrls: ['./gallery-lightbox.component.scss'],
  animations: [
    trigger('animation', [
      transition('void => visible', [
        style({ transform: 'scale(0.5)', opacity: 0 }),
        animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)', 
          style({ transform: 'scale(1)', opacity: 1 })),
      ]),
      transition('visible => void', [
        style({ transform: 'scale(1)', opacity: 1 }),
        animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)', 
          style({ transform: 'scale(0.5)', opacity: 0 })),
      ]),
    ]),
    trigger('animation2', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('150ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('150ms', style({ opacity: 0 })),
      ]),
    ]),
    trigger('staggerAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(15px)' }),
          stagger(50, [
            animate('250ms ease-out', 
              style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ],
})
export class GalleryLightboxComponent implements OnInit {
  @Input() galleryData: Item[] = [];
  @Input() showCount = false;
  previewImage = false;
  showMask = false;
  currentLightboxImage: Item = this.galleryData[0];
  currentIndex = 0;
  controls = true;
  totalImageCount = 0;
  categories: string[] = [];
  selectedCategory: string = 'all';
  filteredGalleryData: Item[] = [];
  zoomLevel: number = 1;
  isDragging: boolean = false;
  startX: number = 0;
  scrollLeft: number = 0;
  viewMode: 'grid' | 'masonry' = 'grid';
  sortBy: 'date' | 'name' | 'likes' = 'date';
  touchStartX: number = 0;
  touchMoveX: number = 0;
  minSwipeDistance: number = 50;
  private page = 1;
  private itemsPerPage = 12;
  private loadedImages: Set<string> = new Set(); // Add this property

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (this.showMask) {
      switch(event.key) {
        case 'ArrowRight':
          this.next();
          break;
        case 'ArrowLeft':
          this.prev();
          break;
        case 'Escape':
          this.onClosePreview();
          break;
      }
    }
  }

  constructor() {}

  ngOnInit(): void {
    // Initialize with all images
    this.totalImageCount = this.galleryData.length;
    this.galleryData = this.galleryData.map(item => ({
      ...item,
      loaded: this.loadedImages.has(item.imageSrc)
    }));
    
    // Extract unique categories
    this.categories = ['all', ...new Set(this.galleryData.map(item => item.category))];
    this.filterImages('all');
  }

  onScroll() {
    // Get all images for current category
    const categoryImages = this.selectedCategory === 'all'
      ? this.galleryData
      : this.galleryData.filter(item => item.category === this.selectedCategory);

    const start = this.page * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    
    // Only proceed if there are more images to load
    if (start < categoryImages.length) {
      const nextImages = categoryImages
        .slice(start, end)
        .map(item => ({
          ...item,
          loaded: this.loadedImages.has(item.imageSrc)
        }));
      
      if (nextImages.length > 0) {
        this.filteredGalleryData = [...this.filteredGalleryData, ...nextImages];
        this.page++;
      }
    }
  }

  filterImages(category: string): void {
    this.selectedCategory = category;
    this.page = 1; // Reset pagination
    
    // Get all images for the selected category
    const filteredImages = category === 'all' 
      ? this.galleryData 
      : this.galleryData.filter(item => item.category === category);
    
    // Update total count for the category
    this.totalImageCount = filteredImages.length;
    
    // Always load itemsPerPage images or all available if less
    const initialBatch = filteredImages.slice(0, this.itemsPerPage);
    
    // Reset filtered gallery data with initial batch
    this.filteredGalleryData = initialBatch.map(item => ({
      ...item,
      loaded: this.loadedImages.has(item.imageSrc)
    }));
  }

  onPreviewImage(index: number): void {
    this.showMask = true;
    this.previewImage = true;
    
    // Find the actual index in the full gallery data
    const currentImage = this.filteredGalleryData[index];
    const fullDataIndex = this.galleryData.findIndex(item => 
      item.imageSrc === currentImage.imageSrc && 
      item.category === currentImage.category
    );
    
    this.currentIndex = fullDataIndex;
    this.currentLightboxImage = this.galleryData[fullDataIndex];
  }

  prev(): void {
    let newIndex = this.currentIndex;
    do {
      newIndex = (newIndex - 1 + this.galleryData.length) % this.galleryData.length;
    } while (
      this.selectedCategory !== 'all' && 
      this.galleryData[newIndex].category !== this.selectedCategory
    );
    
    this.currentIndex = newIndex;
    this.currentLightboxImage = this.galleryData[this.currentIndex];
  }

  next(): void {
    let newIndex = this.currentIndex;
    do {
      newIndex = (newIndex + 1) % this.galleryData.length;
    } while (
      this.selectedCategory !== 'all' && 
      this.galleryData[newIndex].category !== this.selectedCategory
    );
    
    this.currentIndex = newIndex;
    this.currentLightboxImage = this.galleryData[this.currentIndex];
  }

  shareOnWhatsApp() {
    const currentImage = this.galleryData[this.currentIndex];
    const text = `Check out this image: ${window.location.origin}${currentImage.imageSrc}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  }

  onImageLoad(index: number): void {
    const image = this.filteredGalleryData[index];
    this.loadedImages.add(image.imageSrc);
    // Update loaded state in both filtered and main gallery data
    image.loaded = true;
    
    const mainIndex = this.galleryData.findIndex(item => item.imageSrc === image.imageSrc);
    if (mainIndex !== -1) {
      this.galleryData[mainIndex].loaded = true;
    }
  }

  onAnimationEnd(e: AnimationEvent) {
    if (e.toState === 'void') {
      this.showMask = false;
    }
  }

  onClosePreview(event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }
    this.previewImage = false;
  }

  zoomIn() {
    this.zoomLevel = Math.min(this.zoomLevel + 0.25, 3);
  }

  zoomOut() {
    this.zoomLevel = Math.max(this.zoomLevel - 0.25, 1);
  }

  resetZoom() {
    this.zoomLevel = 1;
  }

  downloadImage() {
    const link = document.createElement('a');
    link.href = this.currentLightboxImage.imageSrc;
    link.download = this.currentLightboxImage.imageAlt;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  startDragging(e: MouseEvent) {
    this.isDragging = true;
    this.startX = e.pageX - (e.target as HTMLElement).offsetLeft;
    this.scrollLeft = (e.target as HTMLElement).scrollLeft;
  }

  stopDragging() {
    this.isDragging = false;
  }

  onDrag(e: MouseEvent) {
    if (!this.isDragging) return;
    e.preventDefault();
    const x = e.pageX - (e.target as HTMLElement).offsetLeft;
    const walk = (x - this.startX) * 2;
    (e.target as HTMLElement).scrollLeft = this.scrollLeft - walk;
  }

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
  }

  onTouchMove(event: TouchEvent): void {
    this.touchMoveX = event.touches[0].clientX;
  }

  onTouchEnd(): void {
    const swipeDistance = this.touchStartX - this.touchMoveX;
    
    if (Math.abs(swipeDistance) > this.minSwipeDistance) {
      if (swipeDistance > 0) {
        // Swiped left, show next image
        this.next();
      } else {
        // Swiped right, show previous image
        this.prev();
      }
    }
    
    // Reset values
    this.touchStartX = 0;
    this.touchMoveX = 0;
  }
}
