import prisma from '../config/db.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * Helper to generate URL-friendly slug
 */
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * @route   GET /api/posts
 * @desc    Get all published posts for public profile, or all posts for Admin
 * @access  Public
 */
export const getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, all } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const take = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * take;

    const where = {};

    // Filter published unless explicit request from admin
    if (all !== 'true' || !req.user || req.user.role !== 'ADMIN') {
      where.published = true;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take,
        orderBy: { created_at: 'desc' },
        include: {
          author: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
      prisma.post.count({ where }),
    ]);

    return successResponse(res, 'Daftar artikel/berita berhasil diambil.', {
      posts,
      pagination: {
        total,
        page: pageNum,
        limit: take,
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    console.error('[Get All Posts Error]:', error);
    return errorResponse(res, 'Gagal mengambil daftar berita/artikel.', 500, 'GET_POSTS_ERROR');
  }
};

/**
 * @route   GET /api/posts/:slugOrId
 * @desc    Get single post by slug or ID
 * @access  Public
 */
export const getPostBySlugOrId = async (req, res) => {
  try {
    const { slugOrId } = req.params;

    const post = await prisma.post.findFirst({
      where: {
        OR: [{ id: slugOrId }, { slug: slugOrId }],
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!post) {
      return errorResponse(res, 'Artikel/berita tidak ditemukan.', 404, 'POST_NOT_FOUND');
    }

    // If draft and requester is not Admin, disallow
    if (!post.published && (!req.user || req.user.role !== 'ADMIN')) {
      return errorResponse(res, 'Artikel/berita belum dipublikasikan.', 403, 'POST_UNPUBLISHED');
    }

    return successResponse(res, 'Detail artikel berhasil diambil.', post);
  } catch (error) {
    console.error('[Get Post Detail Error]:', error);
    return errorResponse(res, 'Gagal mengambil detail artikel.', 500, 'GET_POST_DETAIL_ERROR');
  }
};

/**
 * @route   POST /api/posts
 * @desc    Create new post
 * @access  Private (Admin Only)
 */
export const createPost = async (req, res) => {
  try {
    const { title, content, image_url, published = true } = req.body;

    if (!title || !content) {
      return errorResponse(res, 'Judul dan isi konten artikel wajib diisi.', 400, 'VALIDATION_ERROR');
    }

    // Generate unique slug
    let baseSlug = generateSlug(title);
    if (!baseSlug) {
      baseSlug = `post-${Date.now()}`;
    }

    let slug = baseSlug;
    let counter = 1;
    while (await prisma.post.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        image_url: image_url || null,
        published: Boolean(published),
        authorId: req.user.id,
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return successResponse(res, 'Artikel/berita berhasil dibuat.', post, 201);
  } catch (error) {
    console.error('[Create Post Error]:', error);
    return errorResponse(res, 'Gagal membuat artikel baru.', 500, 'CREATE_POST_ERROR');
  }
};

/**
 * @route   PUT /api/posts/:id
 * @desc    Update existing post
 * @access  Private (Admin Only)
 */
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, image_url, published } = req.body;

    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return errorResponse(res, 'Artikel yang akan diperbarui tidak ditemukan.', 404, 'POST_NOT_FOUND');
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (image_url !== undefined) updateData.image_url = image_url;
    if (published !== undefined) updateData.published = Boolean(published);

    // If title changed, update slug
    if (title && title !== existingPost.title) {
      const baseSlug = generateSlug(title);
      let slug = baseSlug;
      let counter = 1;
      while (await prisma.post.findFirst({ where: { slug, id: { not: id } } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      updateData.slug = slug;
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return successResponse(res, 'Artikel berhasil diperbarui.', updatedPost);
  } catch (error) {
    console.error('[Update Post Error]:', error);
    return errorResponse(res, 'Gagal memperbarui artikel.', 500, 'UPDATE_POST_ERROR');
  }
};

/**
 * @route   DELETE /api/posts/:id
 * @desc    Delete post
 * @access  Private (Admin Only)
 */
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return errorResponse(res, 'Artikel tidak ditemukan.', 404, 'POST_NOT_FOUND');
    }

    await prisma.post.delete({
      where: { id },
    });

    return successResponse(res, 'Artikel berhasil dihapus.', { id });
  } catch (error) {
    console.error('[Delete Post Error]:', error);
    return errorResponse(res, 'Gagal menghapus artikel.', 500, 'DELETE_POST_ERROR');
  }
};
