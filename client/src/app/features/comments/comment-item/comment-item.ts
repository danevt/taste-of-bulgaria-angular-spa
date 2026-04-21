import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { Comment } from '../../../models';
import { AuthService } from '../../../core/services';
import { TimeAgo } from '../../../shared/pipes';

@Component({
  selector: 'app-comment-item',
  standalone: true,
  imports: [TimeAgo],
  templateUrl: './comment-item.html',
  styleUrl: './comment-item.css',
})
export class CommentItem {
  @Input() comment!: Comment;
  @Input() recipeId!: string;

  @Output() deleted = new EventEmitter<string>();
  @Output() liked = new EventEmitter<string>();

  private authService = inject(AuthService);

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get isOwner(): boolean {
    const currentUserId = this.authService.getCurrentUserId();
    if (!this.comment || !currentUserId) return false;

    const userId =
      typeof this.comment.userId === 'object' ? this.comment.userId._id : this.comment.userId;
    return userId === currentUserId;
  }

  get isLiked(): boolean {
    const currentUserId = this.authService.getCurrentUserId();
    return this.comment.likes?.includes(currentUserId || '') || false;
  }

  get likesCount(): number {
    return this.comment.likes?.length || 0;
  }

  get username(): string {
    if (typeof this.comment.userId === 'object' && this.comment.userId !== null) {
      return this.comment.userId.username;
    }
    return 'Unknown User';
  }

  onLike() {
    const commentId = typeof this.comment === 'object' ? this.comment._id : this.comment;

    if (commentId) {
      this.liked.emit(commentId);
    } else {
      console.error('ERROR: Missing comment ID!', this.comment);
    }
  }

  deleteComment() {
    if (confirm('Are you sure you want to delete this comment?')) {
      this.deleted.emit(this.comment._id);
    }
  }
}
