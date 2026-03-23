# FSD 아키텍처 리팩토링 워크플로우

## 프로젝트 개요

현재 상태: 기본적인 게시물 관리 시스템으로 모든 로직이 `PostsManagerPage.tsx`에 집중되어 있습니다.
목표: Feature-Sliced Design(FSD) 구조로 리팩토링하여 관심사 분리, 단일 책임 원칙, 재사용성을 확보합니다.

## 현재 문제점

1. **거대한 컴포넌트**: PostsManagerPage.tsx가 700줄 이상으로 모든 기능을 포함
2. **Type 부실**: 타입 정의가 거의 없음 (대부분 `any` 또는 untyped)
3. **상태 관리 부재**: useState만 사용하여 상태가 분산되고 복잡
4. **useEffect 관리 부족**: 의존성 배열이 명확하지 않음
5. **비동기 로직 복잡성**: fetch 체이닝이 복잡하고 에러 처리 미흡
6. **Props Drilling**: 상태를 하위 컴포넌트로 전달하는 구조의 확장성 부족

---

## FSD 폴더 구조 설계

```
src/
├── shared/                          # 모든 feature에서 사용하는 공통 코드
│   ├── ui/                          # UI 컴포넌트 (Button, Input, Dialog 등)
│   │   ├── components/
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── Card/
│   │   │   ├── Dialog/
│   │   │   ├── Table/
│   │   │   ├── Select/
│   │   │   └── Textarea/
│   │   └── index.ts
│   ├── api/                         # 공통 API 설정
│   │   ├── client.ts                # axios 인스턴스
│   │   └── index.ts
│   ├── types/                       # 공통 제네릭 타입 (도메인 타입은 entities에서)
│   │   ├── api.ts                   # ApiResponse, ApiError, Pagination 등
│   │   ├── common.ts                # 공통으로 쓰는 타입들
│   │   └── index.ts
│   ├── hooks/                       # 공통 커스텀 훅
│   │   ├── useQueryParams.ts
│   │   └── index.ts
│   ├── utils/                       # 공통 유틸리티
│   │   ├── highlight.ts
│   │   └── index.ts
│   └── index.ts
│
├── entities/                        # 도메인 엔티티 (Post, Comment, User, Tag) - 타입 정의는 여기서!
│   ├── post/
│   │   ├── model/
│   │   │   ├── types.ts             # Post, PostCreateInput, PostUpdateInput 등
│   │   │   └── index.ts
│   │   ├── api/
│   │   │   ├── postApi.ts           # API 호출 함수들
│   │   │   └── index.ts
│   │   ├── ui/
│   │   │   ├── PostTable/
│   │   │   ├── PostCard/
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── comment/
│   │   ├── model/
│   │   │   ├── types.ts             # Comment, CommentCreateInput 등
│   │   │   └── index.ts
│   │   ├── api/
│   │   │   ├── commentApi.ts
│   │   │   └── index.ts
│   │   ├── ui/
│   │   │   ├── CommentList/
│   │   │   ├── CommentItem/
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── user/
│   │   ├── model/
│   │   │   ├── types.ts             # User, UserProfile 등
│   │   │   └── index.ts
│   │   ├── api/
│   │   │   ├── userApi.ts
│   │   │   └── index.ts
│   │   ├── ui/
│   │   │   ├── UserModal/
│   │   │   ├── UserAvatar/
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   └── tag/
│       ├── model/
│       │   ├── types.ts             # Tag 등
│       │   └── index.ts
│       ├── api/
│       │   ├── tagApi.ts
│       │   └── index.ts
│       ├── ui/
│       │   ├── TagSelect/
│       │   └── index.ts
│       └── index.ts
│
├── features/                        # 비즈니스 기능 (사용자 행동 중심)
│   ├── PostList/
│   │   ├── ui/
│   │   │   ├── PostListContainer/
│   │   │   ├── PostFilters/
│   │   │   ├── PostPagination/
│   │   │   └── index.ts
│   │   ├── model/
│   │   │   ├── store.ts             # 게시물 필터, 정렬 상태
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── CreatePost/
│   │   ├── ui/
│   │   │   ├── CreatePostDialog/
│   │   │   ├── PostForm/
│   │   │   └── index.ts
│   │   ├── model/
│   │   │   ├── store.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── EditPost/
│   │   ├── ui/
│   │   │   ├── EditPostDialog/
│   │   │   └── index.ts
│   │   ├── model/
│   │   │   ├── store.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── DeletePost/
│   │   ├── api/
│   │   │   ├── deletePostAction.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── SearchPosts/
│   │   ├── ui/
│   │   │   ├── SearchInput/
│   │   │   └── index.ts
│   │   ├── model/
│   │   │   ├── store.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── PostDetail/
│   │   ├── ui/
│   │   │   ├── PostDetailDialog/
│   │   │   ├── PostContent/
│   │   │   └── index.ts
│   │   ├── model/
│   │   │   ├── store.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── CommentManagement/
│   │   ├── ui/
│   │   │   ├── AddCommentDialog/
│   │   │   ├── EditCommentDialog/
│   │   │   ├── CommentActions/
│   │   │   └── index.ts
│   │   ├── model/
│   │   │   ├── store.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   └── UserProfile/
│       ├── ui/
│       │   ├── UserInfoModal/
│       │   └── index.ts
│       └── index.ts
│
├── widgets/                         # 컴포지션 계층 (여러 entities/features 결합)
│   ├── PostsManager/
│   │   ├── PostsManagerWidget.tsx    # 모든 기능 통합
│   │   └── index.ts
│   └── index.ts
│
├── pages/
│   ├── PostsManagerPage.tsx          # 축약된 페이지 (widget 사용)
│   └── index.ts
│
├── App.tsx
├── main.tsx
└── index.css
```

---

## 단계별 리팩토링 계획

### Phase 1: 타입 정의 및 구조 설계 (1-2일)

**목표**: 엔티티별 타입을 정의하고 폴더 구조를 준비

**작업**:
```
1. shared/types/ 디렉토리 생성 (공통 타입만)
   - ApiResponse, ApiError 등 API 관련 generic 타입
   - Pagination 타입
   - 모든 feature에서 공유하는 타입들

2. 각 entities별 타입 정의
   - entities/post/model/types.ts → Post, PostCreateInput, PostUpdateInput
   - entities/comment/model/types.ts → Comment, CommentCreateInput
   - entities/user/model/types.ts → User, UserProfile
   - entities/tag/model/types.ts → Tag

3. 폴더 구조 생성
   - 빈 폴더들을 생성하고 index.ts 파일들을 준비
```

### Phase 2: entities 분리 (2-3일)

**목표**: 엔티티별로 타입(types), API, UI를 분리

**작업 순서**:
```
1. entities/post/ 구성
   ├── model/
   │   └── types.ts (Post, PostCreateInput, PostUpdateInput 등)
   ├── api/
   │   ├── postApi.ts (getPosts, addPost, updatePost, deletePost 등)
   │   └── index.ts
   └── ui/
       ├── PostTable/
       ├── PostCard/
       └── index.ts

2. entities/comment/ 구성
   ├── model/
   │   └── types.ts (Comment, CommentCreateInput 등)
   ├── api/
   │   ├── commentApi.ts
   │   └── index.ts
   └── ui/
       ├── CommentList/
       ├── CommentItem/
       └── index.ts

3. entities/user/ 구성
   ├── model/
   │   └── types.ts (User, UserProfile 등)
   ├── api/
   │   ├── userApi.ts
   │   └── index.ts
   └── ui/
       ├── UserModal/
       ├── UserAvatar/
       └── index.ts

4. entities/tag/ 구성
   ├── model/
   │   └── types.ts (Tag 등)
   ├── api/
   │   ├── tagApi.ts
   │   └── index.ts
   └── ui/
       ├── TagSelect/
       └── index.ts
```

### Phase 3: features 분리 (3-4일)

**목표**: 사용자 행동 중심의 기능을 분리 (Zustand 기반 상태 관리)

**사전 준비**: Zustand 5.0.11 설치 완료 ✓

**작업 순서**:
```
1. Zustand 스토어 패턴 이해 및 구현
   - 각 feature에서 store.ts 생성
   - 상태와 액션을 명확히 분리
   - devtools로 디버깅 가능

2. features/PostList/ 구성 (필터, 정렬, 페이지네이션)
   ├── model/store.ts
   │   ├── 상태: skip, limit, sortBy, sortOrder, selectedTag
   │   ├── 액션: setSortBy, setSortOrder, setPagination, selectTag
   │   └── 복합: resetFilters, syncWithURL
   └── ui: PostListContainer, PostFilters, PostPagination

3. features/SearchPosts/ 구성 (검색 기능)
   ├── model/store.ts
   │   ├── 상태: searchQuery, isSearching
   │   └── 액션: setSearchQuery, executeSearch
   └── ui: SearchInput

4. features/CreatePost/ 구성 (새 게시물 추가)
   ├── model/store.ts
   │   ├── 상태: isOpen, title, body, userId, isLoading, error
   │   ├── 액션: openDialog, closeDialog, setTitle, setBody, setUserId, reset
   │   └── 비동기: submitPost
   └── ui: CreatePostDialog, PostForm

5. features/EditPost/ 구성 (게시물 수정)
   ├── model/store.ts
   │   ├── 상태: isOpen, selectedPost, isLoading, error
   │   ├── 액션: openDialog, closeDialog, updateField
   │   └── 비동기: submitUpdate
   └── ui: EditPostDialog, PostForm

6. features/DeletePost/ 구성 (게시물 삭제)
   ├── api/deletePostAction.ts
   │   └── deletePost(id: number): Promise
   └── hook: useDeletePost (선택사항)

7. features/PostDetail/ 구성 (게시물 상세 보기)
   ├── model/store.ts
   │   ├── 상태: isOpen, selectedPost, isLoading
   │   └── 액션: openDialog, closeDialog
   └── ui: PostDetailDialog, PostContent

8. features/CommentManagement/ 구성 (댓글 관리)
   ├── model/store.ts
   │   ├── 상태: addDialogOpen, editDialogOpen, selectedComment, isLoading
   │   └── 액션: 각 dialog 열기/닫기, 댓글 설정
   └── ui: AddCommentDialog, EditCommentDialog, CommentActions, CommentLike

9. features/UserProfile/ 구성 (사용자 정보)
   ├── model/store.ts (필요시)
   │   ├── 상태: isOpen, selectedUser, isLoading
   │   └── 액션: openModal, closeModal
   └── ui: UserInfoModal
```

### Phase 4: widgets & pages 통합 (1-2일)

**목표**: 모든 features와 entities를 조합하여 최종 widget 생성

**작업**:
```
1. widgets/PostsManager/PostsManagerWidget.tsx 생성
   - 모든 features와 entities를 통합
   - Props drilling 최소화 (상태 관리 사용)

2. pages/PostsManagerPage.tsx 수정
   - widget만 렌더링하는 간단한 페이지로 변경
```

---

## 주요 리팩토링 원칙

### 1. 타입 안정성 (entities별 타입 정의)

**Before**:
```typescript
const [posts, setPosts] = useState([])
const [selectedPost, setSelectedPost] = useState(null)
const [newPost, setNewPost] = useState({ title: "", body: "", userId: 1 })
```

**After** (entities/{entity}/model/types.ts에 정의):
```typescript
// entities/post/model/types.ts
export interface Post {
  id: number
  title: string
  body: string
  userId: number
  reactions?: { likes: number; dislikes: number }
  tags?: string[]
  author?: User
}

export interface PostCreateInput {
  title: string
  body: string
  userId: number
}

export interface PostUpdateInput extends PostCreateInput {}

// 컴포넌트에서 사용
import { Post, PostCreateInput } from '@/entities/post'

const [posts, setPosts] = useState<Post[]>([])
const [selectedPost, setSelectedPost] = useState<Post | null>(null)
const [newPost, setNewPost] = useState<PostCreateInput>({
  title: "",
  body: "",
  userId: 1
})
```

### 2. API 분리

**Before**:
```typescript
fetch(`/api/posts?limit=${limit}&skip=${skip}`)
  .then((response) => response.json())
  .then((data) => { setPosts(data.posts) })
  .catch((error) => console.error(error))
```

**After** (entities/{entity}/api/에서 정의):
```typescript
// entities/post/api/postApi.ts
import { Post, PostCreateInput } from '../model/types'
import { apiClient } from '@/shared/api'

interface GetPostsParams {
  limit: number
  skip: number
}

interface PostsResponse {
  posts: Post[]
  total: number
}

export const postApi = {
  async getPosts(params: GetPostsParams): Promise<PostsResponse> {
    const response = await apiClient.get('/posts', { params })
    return response.data
  },

  async addPost(input: PostCreateInput): Promise<Post> {
    const response = await apiClient.post('/posts/add', input)
    return response.data
  },
}

// 컴포넌트에서 사용
import { postApi } from '@/entities/post'

const data = await postApi.getPosts({ limit, skip })
```

### 3. 상태 관리 도입 (Zustand 5.0.11 활용)

**Before** (Props Drilling & 분산된 useState):
```typescript
const PostsManagerPage = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [skip, setSkip] = useState(0)
  const [limit, setLimit] = useState(10)
  const [sortBy, setSortBy] = useState("")
  const [sortOrder, setSortOrder] = useState("asc")
  // ... 15개 이상의 state

  return (
    <PostListContainer
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      skip={skip}
      setSkip={setSkip}
      // ... props drilling 지옥
    />
  )
}
```

**After** (Zustand 기반 중앙 집중식 관리):
```typescript
// features/PostList/model/store.ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface PostListState {
  // 상태
  searchQuery: string
  skip: number
  limit: number
  sortBy: string
  sortOrder: 'asc' | 'desc'
  selectedTag: string

  // 액션
  setSearchQuery: (query: string) => void
  setSkip: (skip: number) => void
  setLimit: (limit: number) => void
  setSortBy: (sortBy: string) => void
  setSortOrder: (order: 'asc' | 'desc') => void
  setSelectedTag: (tag: string) => void

  // 복합 액션
  resetFilters: () => void
  updateURL: () => void
}

export const usePostListStore = create<PostListState>()(
  devtools((set, get) => ({
    // 초기 상태
    searchQuery: "",
    skip: 0,
    limit: 10,
    sortBy: "",
    sortOrder: "asc",
    selectedTag: "",

    // 단순 액션
    setSearchQuery: (query) => set({ searchQuery: query }),
    setSkip: (skip) => set({ skip }),
    setLimit: (limit) => set({ limit }),
    setSortBy: (sortBy) => set({ sortBy }),
    setSortOrder: (order) => set({ sortOrder: order }),
    setSelectedTag: (tag) => set({ selectedTag: tag }),

    // 복합 액션 (여러 상태 동시 변경)
    resetFilters: () => set({
      searchQuery: "",
      sortBy: "",
      sortOrder: "asc",
      selectedTag: "",
      skip: 0,
    }),

    updateURL: () => {
      const state = get()
      const params = new URLSearchParams()
      if (state.skip) params.set("skip", state.skip.toString())
      if (state.limit) params.set("limit", state.limit.toString())
      if (state.searchQuery) params.set("search", state.searchQuery)
      if (state.sortBy) params.set("sortBy", state.sortBy)
      if (state.sortOrder) params.set("sortOrder", state.sortOrder)
      if (state.selectedTag) params.set("tag", state.selectedTag)

      // navigate를 사용하거나 URL 업데이트
      window.history.pushState({}, "", `?${params.toString()}`)
    },
  }), { name: "PostListStore" })
)

// 컴포넌트에서 사용
const SearchInput = () => {
  const { searchQuery, setSearchQuery } = usePostListStore()

  return (
    <input
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="검색..."
    />
  )
}

const Pagination = () => {
  const { skip, limit, setSkip } = usePostListStore()

  return (
    <button onClick={() => setSkip(skip + limit)}>다음</button>
  )
}

// Props Drilling 완전 제거! 🎉
```

### 4. 컴포넌트 분해

**Before**: 700줄의 단일 컴포넌트

**After**: 단일 책임 원칙에 따라 분해
- PostTable: 게시물 테이블 렌더링만
- PostFilters: 필터 UI만
- PostPagination: 페이지네이션만
- SearchInput: 검색 입력만

### 5. useEffect 관리

**Before**:
```typescript
useEffect(() => {
  fetchTags()
}, [])

useEffect(() => {
  if (selectedTag) {
    fetchPostsByTag(selectedTag)
  } else {
    fetchPosts()
  }
  updateURL()
}, [skip, limit, sortBy, sortOrder, selectedTag])

useEffect(() => {
  // URL 파싱 로직
}, [location.search])
```

**After**: 각 기능별 store에서 상태 동기화
```typescript
// features/PostList/model/store.ts에서
const usePostListStore = create((set) => ({
  // ... 상태
  subscribeToUrlChanges: () => { ... },
  syncWithUrl: () => { ... }
}))
```

---

## 타입 정의 가이드 (shared vs entities)

### shared/types에 넣을 것 (모든 feature에서 공유)
```typescript
// shared/types/api.ts - API 관련 제네릭 타입
export interface ApiResponse<T> {
  data: T
  status: number
  message?: string
}

export interface ApiError {
  status: number
  message: string
  errors?: Record<string, string[]>
}

export interface PaginationParams {
  skip: number
  limit: number
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  skip: number
  limit: number
}

// shared/types/common.ts - 공통으로 사용되는 타입
export type SortOrder = 'asc' | 'desc'

export interface DialogState {
  isOpen: boolean
  error?: string
  isLoading?: boolean
}
```

### entities/{entity}/model/types.ts에 넣을 것 (도메인별 타입)
```typescript
// entities/post/model/types.ts
export interface Post {
  id: number
  title: string
  body: string
  userId: number
  reactions?: { likes: number; dislikes: number }
  tags?: string[]
  views?: number
  author?: User
}

export interface PostCreateInput {
  title: string
  body: string
  userId: number
}

export interface PostUpdateInput extends PostCreateInput {}

// entities/comment/model/types.ts
export interface Comment {
  id: number
  body: string
  postId: number
  userId: number
  likes: number
  user?: User
}

export interface CommentCreateInput {
  body: string
  postId: number
  userId: number
}

// entities/user/model/types.ts
export interface User {
  id: number
  username: string
  firstName?: string
  lastName?: string
  email?: string
  age?: number
  phone?: string
  image?: string
  company?: { name: string; title: string }
  address?: { address: string; city: string; state: string }
}

// entities/tag/model/types.ts
export interface Tag {
  slug: string
  url: string
}
```

### 타입 import 패턴
```typescript
// ✅ 올바른 방식
import { Post, PostCreateInput } from '@/entities/post'
import { Comment } from '@/entities/comment'
import { PaginationParams } from '@/shared/types'

// ❌ 피해야 할 방식
import { Post } from '@/shared/types'  // Post는 entities에 있음!
import { PaginationParams } from '@/entities/post/types'  // 공통 타입은 shared에서!
```

---

## Zustand 스토어 패턴 가이드

### 기본 패턴
```typescript
// features/CreatePost/model/store.ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface CreatePostState {
  // UI 상태
  isOpen: boolean
  isLoading: boolean
  error: string | null

  // 폼 데이터
  title: string
  body: string
  userId: number

  // 액션
  openDialog: () => void
  closeDialog: () => void
  setTitle: (title: string) => void
  setBody: (body: string) => void
  setUserId: (userId: number) => void
  reset: () => void
  setError: (error: string | null) => void
  setLoading: (loading: boolean) => void

  // 비동기 액션
  submitPost: () => Promise<void>
}

const initialState = {
  isOpen: false,
  isLoading: false,
  error: null,
  title: "",
  body: "",
  userId: 1,
}

export const useCreatePostStore = create<CreatePostState>()(
  devtools((set, get) => ({
    ...initialState,

    openDialog: () => set({ isOpen: true }),
    closeDialog: () => set({ isOpen: false, error: null }),
    setTitle: (title) => set({ title }),
    setBody: (body) => set({ body }),
    setUserId: (userId) => set({ userId }),
    setError: (error) => set({ error }),
    setLoading: (loading) => set({ isLoading: loading }),

    reset: () => set(initialState),

    submitPost: async () => {
      const state = get()
      set({ isLoading: true, error: null })

      try {
        const response = await fetch("/api/posts/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: state.title,
            body: state.body,
            userId: state.userId,
          }),
        })

        if (!response.ok) throw new Error("게시물 생성 실패")

        const data = await response.json()
        set({ isOpen: false, isLoading: false })
        get().reset()

        // 게시물 목록 업데이트 (다른 store와 연동)
        // usePostListStore.getState().addPost(data)

        return data
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : "알 수 없는 오류",
          isLoading: false,
        })
        throw error
      }
    },
  }), { name: "CreatePostStore" })
)
```

### useShallow (선택적 구독) - Zustand 5.0+
```typescript
// 전체 상태를 구독하면 모든 상태 변경 시 리렌더링
const { isOpen, title, body } = useCreatePostStore()

// useShallow를 사용하면 선택된 필드만 변경 시 리렌더링
const { isOpen, title } = useCreatePostStore(
  useShallow((state) => ({ isOpen: state.isOpen, title: state.title }))
)

// 또는 더 간단하게
const isOpen = useCreatePostStore((state) => state.isOpen)
const title = useCreatePostStore((state) => state.title)
```

### 스토어 간 연동
```typescript
// 게시물 생성 후 목록 업데이트
submitPost: async () => {
  try {
    const newPost = await postApi.addPost(...)
    // 다른 store의 상태 업데이트
    usePostListStore.getState().prependPost(newPost)
    set({ isOpen: false })
  } catch (error) {
    set({ error: error.message })
  }
}

// 또는 콜백 패턴
submitPost: async (onSuccess: (post: Post) => void) => {
  try {
    const newPost = await postApi.addPost(...)
    set({ isOpen: false })
    onSuccess(newPost)
  } catch (error) {
    set({ error: error.message })
  }
}
```

### DevTools 확장 프로그램 사용
```typescript
// 1. React DevTools 브라우저 확장 설치
// 2. Zustand는 자동으로 devtools 미들웨어로 감시
// 3. Redux DevTools에서 액션 추적 가능

// 액션 이름 지정 (선택사항)
export const usePostListStore = create<PostListState>()(
  devtools((set) => ({...}), { name: "PostListStore" })
)
```

---

## 점진적 마이그레이션 전략

### Option A: 한번에 큰 리팩토링
- 장점: 빠르고 명확한 결과
- 단점: 버그 위험이 높고 동시에 많은 변경 발생

### Option B: 기능별 점진적 마이그레이션 (권장)
1. 먼저 shared/types 설정 (다른 모든 작업의 기반)
2. entities 분리 (순서: post → comment → user → tag)
3. features 구현 (한 feature씩 완전히 마이그레이션)
4. widget 통합
5. 최종 테스트 및 정리

**각 단계별 커밋**:
```
- refactor: shared types 정의
- refactor: entities/post 분리
- refactor: entities/comment 분리
- refactor: features/PostList 구현
- refactor: features/SearchPosts 구현
- ... (계속)
- refactor: PostsManager widget 통합 및 최종 마이그레이션
```

---

## 체크리스트

### Type 안정성
- [ ] shared/types에 공통 타입 정의 (ApiResponse, ApiError, Pagination)
- [ ] entities/post/model/types.ts 정의 (Post, PostCreateInput, PostUpdateInput)
- [ ] entities/comment/model/types.ts 정의 (Comment, CommentCreateInput)
- [ ] entities/user/model/types.ts 정의 (User, UserProfile)
- [ ] entities/tag/model/types.ts 정의 (Tag)
- [ ] 모든 컴포넌트 Props 타입 정의 완료
- [ ] API 응답 타입이 entities 타입과 일치

### 상태 관리 (Zustand 5.0.11)
- [ ] usePostListStore 생성 (필터, 정렬, 페이지네이션)
  - [ ] skip, limit, sortBy, sortOrder, selectedTag 상태
  - [ ] setSortBy, setSortOrder, setSkip, setLimit 액션
  - [ ] resetFilters, syncWithURL 복합 액션
- [ ] useSearchStore 생성
  - [ ] searchQuery 상태 및 setSearchQuery 액션
- [ ] useCreatePostStore 생성
  - [ ] 폼 필드 상태 (title, body, userId)
  - [ ] UI 상태 (isOpen, isLoading, error)
  - [ ] submitPost 비동기 액션
- [ ] useEditPostStore 생성
  - [ ] selectedPost, isOpen, isLoading 상태
  - [ ] submitUpdate 비동기 액션
- [ ] usePostDetailStore 생성
  - [ ] selectedPost, isOpen 상태
- [ ] useCommentStore 생성
  - [ ] 여러 dialog 상태 관리
  - [ ] addComment, updateComment, deleteComment 액션
- [ ] useUserStore 생성 (선택사항)
- [ ] Props Drilling 100% 제거 확인
- [ ] DevTools로 상태 변화 추적 가능한지 확인

### 컴포넌트 분해
- [ ] 공통 UI 컴포넌트 정리 (shared/ui)
- [ ] 엔티티별 UI 컴포넌트 분리
- [ ] 기능별 UI 컴포넌트 분리
- [ ] 각 컴포넌트의 단일 책임 원칙 준수

### API 분리
- [ ] Post API 분리
- [ ] Comment API 분리
- [ ] User API 분리
- [ ] Tag API 분리
- [ ] 공통 API 클라이언트 설정

### 테스트 & 검증
- [ ] 모든 기능이 정상 작동하는지 확인
- [ ] 타입 체크 통과 (`tsc -b`)
- [ ] ESLint 통과 (`npm run lint`)
- [ ] 개발 서버 정상 실행 (`npm run dev`)

---

## 추가 고려사항

### TanStack Query (선택사항 - Advanced 과제)
성능 최적화를 위해 나중에 도입 가능:
```typescript
import { useQuery, useMutation } from '@tanstack/react-query'

const { data: posts, isLoading } = useQuery({
  queryKey: ['posts', { skip, limit }],
  queryFn: () => postApi.getPosts({ skip, limit })
})
```

### 설치된 상태 관리: Zustand 5.0.11 ✓

**Zustand 사용 이유:**
- 최소한의 보일러플레이트 (Context API의 복잡성 없음)
- 간편한 상태 구독 (성능 최적화 가능)
- DevTools 연동으로 디버깅 용이
- TypeScript 완벽 지원
- 미들웨어 시스템 (devtools, immer 등 지원)

**기타 대안:**
- **Context API**: 내장이지만 보일러플레이트 많음, 성능 최적화 어려움
- **Jotai**: 원자적 상태 관리로 세분화된 제어 가능 (더 복잡할 수 있음)
- **TanStack Query**: 서버 상태 관리 (Advanced 과제에서 고려)

### 스타일 관리
현재: Tailwind CSS 인라인
개선 방향:
- 컴포넌트별 스타일 파일 분리 (선택사항)
- CSS-in-JS 라이브러리 도입 (선택사항)

---

## Zustand 빠른 시작 가이드 (설치 완료 ✓)

### 1. 기본 스토어 생성
```bash
# 파일 위치: features/MyFeature/model/store.ts
# 패턴 참고: 위의 "Zustand 스토어 패턴 가이드" 섹션
```

### 2. 컴포넌트에서 사용
```typescript
// features/MyFeature/ui/MyComponent.tsx
import { useMyStore } from '../model/store'

const MyComponent = () => {
  const { value, setValue } = useMyStore()

  return <input value={value} onChange={(e) => setValue(e.target.value)} />
}
```

### 3. 상태 초기화 패턴
```typescript
// 초기값을 상수로 정의하여 reset에 사용
const initialState = {
  isOpen: false,
  loading: false,
  data: null,
}

export const useMyStore = create((set) => ({
  ...initialState,
  reset: () => set(initialState),
}))
```

### 4. 디버깅
```typescript
// 브라우저 DevTools에서 Zustand 상태 확인
// Redux DevTools 브라우저 확장 사용 가능

// 또는 콘솔에서 직접 확인
const state = useMyStore.getState()
console.log(state)

// 상태 변화 구독
const unsubscribe = useMyStore.subscribe(
  (state) => console.log(state)
)
```

### 5. 마이그레이션 팁
```typescript
// 기존 useState
const [query, setQuery] = useState("")
const [results, setResults] = useState([])

// Zustand로 변환
interface SearchState {
  query: string
  results: SearchResult[]
  setQuery: (query: string) => void
  setResults: (results: SearchResult[]) => void
}

const useSearchStore = create<SearchState>((set) => ({
  query: "",
  results: [],
  setQuery: (query) => set({ query }),
  setResults: (results) => set({ results }),
}))
```

---

## 리소스

- [FSD 공식 문서](https://feature-sliced.design/)
- [Zustand 공식 문서](https://github.com/pmndrs/zustand)
- [Zustand DevTools 사용](https://github.com/pmndrs/zustand/blob/main/docs/guides/typescript.md)
- [React 베스트 프랙티스](https://react.dev)
