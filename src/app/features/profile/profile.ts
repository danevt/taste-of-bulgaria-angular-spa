// import { Component, inject, OnInit } from '@angular/core';
// import { RouterLink } from '@angular/router';
// import { AuthService, RecipeService } from '../../core/services';
// import { Recipe, User } from '../../models';
// import { DatePipe } from '@angular/common';

// @Component({
//   selector: 'app-profile',
//   standalone: true,
//   imports: [RouterLink, DatePipe],
//   templateUrl: './profile.html',
//   styleUrl: './profile.css',
// })
// export class Profile implements OnInit {
//   private authService = inject(AuthService);
//   private recipeService = inject(RecipeService);

//   user: User | null = null;
//   userRecipes: Recipe[] = [];

//   ngOnInit() {
//     this.user = this.authService.currentUser();

//     if (this.user) {
//       this.recipeService.getAllRecipes().subscribe({
//         next: (recipes) => {
//           this.userRecipes = recipes.filter((recipe) =>
//             typeof recipe.userId === 'object'
//               ? recipe.userId._id === this.user!._id
//               : recipe.userId === this.user!._id,
//           );
//         },
//         error: (err) => console.error('Failed to load user recipes', err),
//       });
//     }
//   }
// }

import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService, RecipeService } from '../../core/services';
import { Recipe, User } from '../../models';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private authService = inject(AuthService);
  private recipeService = inject(RecipeService);

  user: User | null = null;
  userRecipes: Recipe[] = [];
  favoriteRecipes: Recipe[] = [];

  ngOnInit() {
    this.user = this.authService.currentUser();

    if (this.user) {
      this.recipeService.getAllRecipes().subscribe({
        next: (recipes) => {
          this.userRecipes = recipes.filter((recipe) =>
            typeof recipe.userId === 'object'
              ? recipe.userId._id === this.user!._id
              : recipe.userId === this.user!._id,
          );

          this.favoriteRecipes = recipes.filter((recipe) =>
            recipe.favorites.includes(this.user!._id),
          );
        },
        error: (err) => console.error('Failed to load recipes', err),
      });
    }
  }
}
