import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-stadistics-details',
  imports: [CommonModule, RouterModule],
  templateUrl: './stadistics-details.component.html',
  styleUrl: './stadistics-details.component.scss'
})
export class StadisticsDetailsComponent {
  idTeam: string | null = null;
  sectionsState: { [key: number]: boolean } = {
    1: true,
    2: true,
    3: true,
    4: true,
    5: true
  };
  matches: { result: string, idLocal: number, nameLocal: string, idVisitor: number, nameVisitor: string, imageLocal: string, imageVisitor: string, scoreLocal: number, scoreVisitor: number 
  }[] = [
    {
      result: 'G', idLocal: 1, nameLocal: "Real Racing Club de Santander", idVisitor: 2, nameVisitor: "Real Madrid", imageLocal: "/images/fc_barcelona.png", imageVisitor: "/images/real_madrid.png", scoreLocal: 20, scoreVisitor: 50
    },
    {
      result: 'P', idLocal: 3, nameLocal: "Manchester United", idVisitor: 1, nameVisitor: "FC Barcelona", imageLocal: "/images/fc_barcelona.png", imageVisitor: "/images/union_berlin.png", scoreLocal: 0, scoreVisitor: 3
    }
  ];

  constructor (private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.idTeam = this.decodeRandomCode(id);
      }
    })
  }

  decodeRandomCode(id: string): string {
    return atob(id);
  }

  generateRandomCode(id: number): string{
    return btoa(id.toString()).replace(/=/g, '');
  }

  toggleCard(section: number) {
    this.sectionsState[section] = !this.sectionsState[section];
  }
}
