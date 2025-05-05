import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Users and settings routes
  app.get("/api/users/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await storage.getUser(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Don't send password in response
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  app.patch("/api/users/:id/settings", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const settingsSchema = z.object({
      preferredVoice: z.string().optional(),
      textSize: z.number().min(1).max(5).optional(),
      readingSpeed: z.number().min(1).max(5).optional(),
      highContrast: z.boolean().optional(),
      colorTheme: z.string().optional(),
      audioDescriptions: z.boolean().optional(),
      keyboardNavigation: z.boolean().optional(),
      voiceSensitivity: z.number().min(1).max(5).optional(),
      autoAdvance: z.boolean().optional(),
      notificationSounds: z.boolean().optional(),
    });

    try {
      const settings = settingsSchema.parse(req.body);
      const updatedUser = await storage.updateUserSettings(id, settings);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Don't send password in response
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid settings data", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  // Courses routes
  app.get("/api/courses", async (req, res) => {
    const courses = await storage.getCourses();
    res.json(courses);
  });

  app.get("/api/courses/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    const course = await storage.getCourse(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);
  });

  app.patch("/api/courses/:id/progress", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    const progressSchema = z.object({
      progress: z.number().min(0).max(100),
    });

    try {
      const { progress } = progressSchema.parse(req.body);
      const updatedCourse = await storage.updateCourseProgress(id, progress);
      
      if (!updatedCourse) {
        return res.status(404).json({ message: "Course not found" });
      }

      res.json(updatedCourse);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid progress data", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  // Lessons routes
  app.get("/api/courses/:courseId/lessons", async (req, res) => {
    const courseId = parseInt(req.params.courseId);
    if (isNaN(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    const lessons = await storage.getLessons(courseId);
    res.json(lessons);
  });

  app.get("/api/lessons/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid lesson ID" });
    }

    const lesson = await storage.getLesson(id);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    res.json(lesson);
  });

  // Sections routes
  app.get("/api/lessons/:lessonId/sections", async (req, res) => {
    const lessonId = parseInt(req.params.lessonId);
    if (isNaN(lessonId)) {
      return res.status(400).json({ message: "Invalid lesson ID" });
    }

    const sections = await storage.getSections(lessonId);
    res.json(sections);
  });

  // Quiz routes
  app.get("/api/lessons/:lessonId/quiz", async (req, res) => {
    const lessonId = parseInt(req.params.lessonId);
    if (isNaN(lessonId)) {
      return res.status(400).json({ message: "Invalid lesson ID" });
    }

    const quiz = await storage.getQuiz(lessonId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.json(quiz);
  });

  // Questions routes
  app.get("/api/quizzes/:quizId/questions", async (req, res) => {
    const quizId = parseInt(req.params.quizId);
    if (isNaN(quizId)) {
      return res.status(400).json({ message: "Invalid quiz ID" });
    }

    const questions = await storage.getQuestions(quizId);
    res.json(questions);
  });

  // Assignments routes
  app.get("/api/courses/:courseId/assignments", async (req, res) => {
    const courseId = parseInt(req.params.courseId);
    if (isNaN(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    const assignments = await storage.getAssignments(courseId);
    res.json(assignments);
  });

  const httpServer = createServer(app);
  return httpServer;
}
