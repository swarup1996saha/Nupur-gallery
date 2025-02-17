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
    this.totalImageCount = this.galleryData.length;
    this.galleryData = this.galleryData.map(item => ({
      ...item,
      loaded: false
    }));
    
    // Extract unique categories
    this.categories = ['all', ...new Set(this.galleryData.map(item => item.category))];
    this.filterImages('all');
  }

  filterImages(category: string): void {
    this.selectedCategory = category;
    let filtered = category === 'all' 
      ? this.galleryData 
      : this.galleryData.filter(item => item.category === category);
    
    // Apply sorting
    filtered = this.sortImages(filtered);
    
    this.filteredGalleryData = filtered;
  }
  
  sortImages(images: Item[]): Item[] {
    return images.sort((a, b) => {
      switch(this.sortBy) {
        case 'date':
          return (b.dateAdded?.getTime() || 0) - (a.dateAdded?.getTime() || 0);
        case 'name':
          return a.imageAlt.localeCompare(b.imageAlt);
        case 'likes':
          return (b.likes || 0) - (a.likes || 0);
        default:
          return 0;
      }
    });
  }
  
  toggleFavorite(image: Item, event: Event): void {
    event.stopPropagation();
    image.isFavorite = !image.isFavorite;
    image.likes = (image.likes || 0) + (image.isFavorite ? 1 : -1);
  }
  
  shareImage(image: Item, platform: 'facebook' | 'twitter' | 'whatsapp'): void {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out this image: ${image.description || image.imageAlt}`);
    
    switch(platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`);
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${text} ${url}`);
        break;
    }
  }

  onPreviewImage(index: number): void {
    this.showMask = true;
    this.previewImage = true;
    this.currentIndex = index;
    this.currentLightboxImage = this.galleryData[index];
  }

  onImageLoad(index: number): void {
    this.galleryData[index].loaded = true;
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

  prev(): void {
    this.currentIndex = (this.currentIndex + 1) % this.galleryData.length;
    this.currentLightboxImage = this.galleryData[this.currentIndex];
  }

  next(): void {
    this.currentIndex = this.currentIndex - 1;
    if (this.currentIndex < 0) {
      this.currentIndex = this.galleryData.length - 1;
    }
    this.currentLightboxImage = this.galleryData[this.currentIndex];
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
