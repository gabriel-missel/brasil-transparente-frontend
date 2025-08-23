import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  copyPixKey(): void {
    navigator.clipboard.writeText('brasiltransparente@pm.me');
    const button = document.querySelector('.donation-pix-copy-btn');
    if (button) button.textContent = 'Copiado!';

    setTimeout(() => {
      if (button) button.textContent = 'Copiar';
    }, 1500);
  }
}