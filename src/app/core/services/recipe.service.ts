import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recipe } from '../../models/recipe.model';
import { RECIPES_BASE } from '../constants/api.constants';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private options = { withCredentials: true };

  constructor(private http: HttpClient) {}

  getAllRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(RECIPES_BASE);
  }

  getRecipeById(id: string): Observable<Recipe> {
    return this.http.get<Recipe>(`${RECIPES_BASE}/${id}`);
  }

  createRecipe(recipeData: any): Observable<Recipe> {
    return this.http.post<Recipe>(RECIPES_BASE, recipeData, this.options);
  }

  editRecipe(id: string, recipeData: any): Observable<Recipe> {
    return this.http.put<Recipe>(`${RECIPES_BASE}/${id}`, recipeData, this.options);
  }

  deleteRecipe(id: string): Observable<any> {
    return this.http.delete(`${RECIPES_BASE}/${id}`, this.options);
  }

  toggleFavorite(recipeId: string): Observable<Recipe> {
    return this.http.put<Recipe>(`${RECIPES_BASE}/${recipeId}/favorite`, {}, this.options);
  }
}
