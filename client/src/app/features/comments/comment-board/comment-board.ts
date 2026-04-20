import { Component, Input, inject, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommentService, AuthService } from '../../../core/services';
import { Comment } from '../../../models';
import { CommentItem } from '../comment-item/comment-item';

@Component({
  selector: 'app-comment-board',
  imports: [FormsModule, CommentItem],
  templateUrl: './comment-board.html',
  styleUrl: './comment-board.css',
})
export class CommentBoard implements OnInit {
  @Input() recipeId!: string;
  @Input() comments: Comment[] = [];

  private commentService = inject(CommentService);
  private authService = inject(AuthService);

  isLoggedIn = this.authService.isLoggedIn;
  newCommentText = '';

  ngOnInit() {
    if (this.comments) {
      this.comments = [...this.comments].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    }
  }

  onSubmit(form: NgForm) {
    if (form.invalid || !this.newCommentText.trim()) return;

    this.commentService.createComment(this.recipeId, this.newCommentText).subscribe({
      next: (newComment: Comment) => {
        const currentUser = this.authService.currentUser();
        if (currentUser) {
          newComment.userId = {
            _id: currentUser._id,
            username: currentUser.username,
            email: currentUser.email,
          };
        }

        this.comments = [newComment, ...this.comments];

        this.newCommentText = '';
        form.reset();
      },
      error: (err: any) => console.error('Failed to add comment', err),
    });
  }

  onCommentLiked(commentId: string) {
    this.commentService.likeComment(this.recipeId, commentId).subscribe({
      next: (updatedComment: Comment) => {
        const index = this.comments.findIndex((c) => c._id === commentId);
        if (index !== -1) {
          this.comments[index] = {
            ...this.comments[index],
            likes: updatedComment.likes,
          };
        }
      },
      error: (err: any) => {
        console.error('Failed to like comment', err);
        const msg = err.error?.message || 'Action failed';
        alert(msg);
      },
    });
  }

  onCommentDeleted(commentId: string) {
    this.commentService.deleteComment(this.recipeId, commentId).subscribe({
      next: () => {
        this.comments = this.comments.filter((c) => c._id !== commentId);
      },
      error: (err: any) => console.error('Failed to delete comment', err),
    });
  }
}
