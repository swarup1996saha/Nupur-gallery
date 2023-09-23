import { Component } from '@angular/core';
interface Item{
  imageSrc: string;
  imageAlt: string
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'image-gallery';

  data: Item[] = [
    {
      imageSrc: '../assets/images/image1.jpg',
      imageAlt: '1'
    },
    {
      imageSrc: '../assets/images/image3.jpg',
      imageAlt: '2'
    },
    {
      imageSrc: '../assets/images/image2.jpg',
      imageAlt: '3'
    },
    {
      imageSrc: '../assets/images/image4.jpg',
      imageAlt: '4'
    },
    {
      imageSrc: '../assets/images/image5.jpg',
      imageAlt: '5'
    },
    {
      imageSrc: '../assets/images/image6.jpg',
      imageAlt: '6'
    },
    {
      imageSrc: '../assets/images/image7.jpg',
      imageAlt: '7'
    },
    {
      imageSrc: '../assets/images/image8.jpg',
      imageAlt: '8'
    },
    {
      imageSrc: '../assets/images/image9.jpg',
      imageAlt: '9'
    },
    {
      imageSrc: '../assets/images/image10.jpg',
      imageAlt: '10'
    },
    {
      imageSrc: '../assets/images/11.jpg',
      imageAlt: '11'
    },
    {
      imageSrc: '../assets/images/13.jpg',
      imageAlt: '12'
    },
    {
      imageSrc: '../assets/images/15.jpg',
      imageAlt: '13'
    },
    {
      imageSrc: '../assets/images/17.jpg',
      imageAlt: '14'
    },
    {
      imageSrc: '../assets/images/19.jpg',
      imageAlt: '15'
    },
    {
      imageSrc: '../assets/images/21.jpg',
      imageAlt: '16'
    },
    {
      imageSrc: '../assets/images/23.jpg',
      imageAlt: '17'
    },
    {
      imageSrc: '../assets/images/29.jpg',
      imageAlt: '18'
    },
    {
      imageSrc: '../assets/images/31.jpg',
      imageAlt: '19'
    },{
      imageSrc: '../assets/images/12.jpg',
      imageAlt: '20'
    },
    {
      imageSrc: '../assets/images/14.jpg',
      imageAlt: '21'
    },
    {
      imageSrc: '../assets/images/16.jpg',
      imageAlt: '22'
    },
    {
      imageSrc: '../assets/images/30.jpg',
      imageAlt: '23'
    },
    {
      imageSrc: '../assets/images/18.jpg',
      imageAlt: '24'
    },
    {
      imageSrc: '../assets/images/20.jpg',
      imageAlt: '25'
    },
    {
      imageSrc: '../assets/images/22.jpg',
      imageAlt: '26'
    },
    {
      imageSrc: '../assets/images/26.jpg',
      imageAlt: '27'
    },
    {
      imageSrc: '../assets/images/28.jpg',
      imageAlt: '28'
    },

  ]
}
