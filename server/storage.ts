import { 
  User, InsertUser, users, 
  Course, InsertCourse, courses,
  Lesson, InsertLesson, lessons,
  Section, InsertSection, sections,
  Quiz, InsertQuiz, quizzes,
  Question, InsertQuestion, questions,
  Assignment, InsertAssignment, assignments
} from "@shared/schema";

// Storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserSettings(id: number, settings: Partial<User>): Promise<User | undefined>;

  // Course methods
  getCourses(): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourseProgress(id: number, progress: number): Promise<Course | undefined>;

  // Lesson methods
  getLessons(courseId: number): Promise<Lesson[]>;
  getLesson(id: number): Promise<Lesson | undefined>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;

  // Section methods
  getSections(lessonId: number): Promise<Section[]>;
  getSection(id: number): Promise<Section | undefined>;
  createSection(section: InsertSection): Promise<Section>;

  // Quiz methods
  getQuiz(lessonId: number): Promise<Quiz | undefined>;
  createQuiz(quiz: InsertQuiz): Promise<Quiz>;

  // Question methods
  getQuestions(quizId: number): Promise<Question[]>;
  getQuestion(id: number): Promise<Question | undefined>;
  createQuestion(question: InsertQuestion): Promise<Question>;

  // Assignment methods
  getAssignments(courseId: number): Promise<Assignment[]>;
  getAssignment(id: number): Promise<Assignment | undefined>;
  createAssignment(assignment: InsertAssignment): Promise<Assignment>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private courses: Map<number, Course>;
  private lessons: Map<number, Lesson>;
  private sections: Map<number, Section>;
  private quizzes: Map<number, Quiz>;
  private questions: Map<number, Question>;
  private assignments: Map<number, Assignment>;
  
  private userIdCounter: number;
  private courseIdCounter: number;
  private lessonIdCounter: number;
  private sectionIdCounter: number;
  private quizIdCounter: number;
  private questionIdCounter: number;
  private assignmentIdCounter: number;

  constructor() {
    this.users = new Map();
    this.courses = new Map();
    this.lessons = new Map();
    this.sections = new Map();
    this.quizzes = new Map();
    this.questions = new Map();
    this.assignments = new Map();
    
    this.userIdCounter = 1;
    this.courseIdCounter = 1;
    this.lessonIdCounter = 1;
    this.sectionIdCounter = 1;
    this.quizIdCounter = 1;
    this.questionIdCounter = 1;
    this.assignmentIdCounter = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { 
      ...insertUser, 
      id,
      preferredVoice: "female_standard",
      textSize: 3,
      readingSpeed: 3,
      highContrast: false,
      colorTheme: "standard",
      audioDescriptions: true,
      keyboardNavigation: true,
      voiceSensitivity: 3,
      autoAdvance: false,
      notificationSounds: true
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserSettings(id: number, settings: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...settings };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Course methods
  async getCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }

  async getCourse(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const id = this.courseIdCounter++;
    const course: Course = { ...insertCourse, id, progress: 0 };
    this.courses.set(id, course);
    return course;
  }

  async updateCourseProgress(id: number, progress: number): Promise<Course | undefined> {
    const course = this.courses.get(id);
    if (!course) return undefined;
    
    const updatedCourse = { ...course, progress };
    this.courses.set(id, updatedCourse);
    return updatedCourse;
  }

  // Lesson methods
  async getLessons(courseId: number): Promise<Lesson[]> {
    return Array.from(this.lessons.values())
      .filter(lesson => lesson.courseId === courseId)
      .sort((a, b) => a.order - b.order);
  }

  async getLesson(id: number): Promise<Lesson | undefined> {
    return this.lessons.get(id);
  }

  async createLesson(insertLesson: InsertLesson): Promise<Lesson> {
    const id = this.lessonIdCounter++;
    const lesson: Lesson = { ...insertLesson, id };
    this.lessons.set(id, lesson);
    return lesson;
  }

  // Section methods
  async getSections(lessonId: number): Promise<Section[]> {
    return Array.from(this.sections.values())
      .filter(section => section.lessonId === lessonId)
      .sort((a, b) => a.order - b.order);
  }

  async getSection(id: number): Promise<Section | undefined> {
    return this.sections.get(id);
  }

  async createSection(insertSection: InsertSection): Promise<Section> {
    const id = this.sectionIdCounter++;
    const section: Section = { ...insertSection, id };
    this.sections.set(id, section);
    return section;
  }

  // Quiz methods
  async getQuiz(lessonId: number): Promise<Quiz | undefined> {
    return Array.from(this.quizzes.values()).find(
      quiz => quiz.lessonId === lessonId
    );
  }

  async createQuiz(insertQuiz: InsertQuiz): Promise<Quiz> {
    const id = this.quizIdCounter++;
    const quiz: Quiz = { ...insertQuiz, id };
    this.quizzes.set(id, quiz);
    return quiz;
  }

  // Question methods
  async getQuestions(quizId: number): Promise<Question[]> {
    return Array.from(this.questions.values())
      .filter(question => question.quizId === quizId)
      .sort((a, b) => a.order - b.order);
  }

  async getQuestion(id: number): Promise<Question | undefined> {
    return this.questions.get(id);
  }

  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const id = this.questionIdCounter++;
    const question: Question = { ...insertQuestion, id };
    this.questions.set(id, question);
    return question;
  }

  // Assignment methods
  async getAssignments(courseId: number): Promise<Assignment[]> {
    return Array.from(this.assignments.values())
      .filter(assignment => assignment.courseId === courseId);
  }

  async getAssignment(id: number): Promise<Assignment | undefined> {
    return this.assignments.get(id);
  }

  async createAssignment(insertAssignment: InsertAssignment): Promise<Assignment> {
    const id = this.assignmentIdCounter++;
    const assignment: Assignment = { ...insertAssignment, id };
    this.assignments.set(id, assignment);
    return assignment;
  }

  // Initialize sample data
  private initializeSampleData() {
    // Create a sample user
    this.createUser({
      username: "student",
      password: "password"
    });
    
    // Create sample course
    const programmingCourse = this.createCourse({
      title: "Introduction to Programming",
      description: "Learn the basics of programming concepts and languages."
    });

    // Update course progress
    this.updateCourseProgress(1, 0);

    // Create sample lessons for programming course
    this.createLesson({
      courseId: 1,
      title: "Introduction to Programming Concepts",
      order: 1
    });

    this.createLesson({
      courseId: 1,
      title: "Variables and Data Types",
      order: 2
    });

    this.createLesson({
      courseId: 1,
      title: "Control Structures",
      order: 3
    });

    this.createLesson({
      courseId: 1,
      title: "Loops and Iterations",
      order: 4
    });

    this.createLesson({
      courseId: 1,
      title: "Functions",
      order: 5
    });

    // Create sections for the Functions lesson
    this.createSection({
      lessonId: 5,
      title: "Functions Introduction",
      content: "This section explains what functions are and how they help organize code. Functions are reusable blocks of code that perform a specific task. They help you avoid repetition and make your code more organized and easier to understand.",
      order: 1
    });

    this.createSection({
      lessonId: 5,
      title: "Function Parameters",
      content: "Learn how to define and use parameters in your functions. Parameters are values that you can pass to a function when you call it. They allow your functions to work with different data each time they're called.",
      order: 2
    });

    this.createSection({
      lessonId: 5,
      title: "Return Values",
      content: "Understand how functions can return values to calling code. The return statement allows a function to compute a value and send it back to the code that called the function. This makes functions even more versatile and powerful.",
      order: 3
    });

    // Create a quiz for the Functions lesson
    this.createQuiz({
      lessonId: 5,
      title: "Functions in Programming"
    });

    // Create questions for the quiz
    this.createQuestion({
      quizId: 1,
      question: "What are functions in programming?",
      options: [
        "Variables that store multiple values",
        "Reusable blocks of code that perform specific tasks",
        "Special operators for mathematical calculations",
        "Comments that explain the code"
      ] as string[],
      correctAnswer: 1,
      order: 1
    });

    this.createQuestion({
      quizId: 1,
      question: "What is the purpose of parameters in a function?",
      options: [
        "To give the function a name",
        "To determine how fast the function runs",
        "To pass data into the function",
        "To display results on the screen"
      ] as string[],
      correctAnswer: 2,
      order: 2
    });

    this.createQuestion({
      quizId: 1,
      question: "What is the purpose of a return statement in a function?",
      options: [
        "To end the function execution",
        "To return a value to the caller",
        "To print output to the console",
        "To create a new variable"
      ] as string[],
      correctAnswer: 1,
      order: 3
    });

    this.createQuestion({
      quizId: 1,
      question: "Which of the following is a benefit of using functions?",
      options: [
        "They make the program run slower",
        "They require more memory",
        "They reduce code duplication",
        "They limit what a program can do"
      ] as string[],
      correctAnswer: 2,
      order: 4
    });

    this.createQuestion({
      quizId: 1,
      question: "What happens if a function has no return statement?",
      options: [
        "The function will cause an error",
        "The function will return the value 0",
        "The function will return undefined",
        "The function will continue executing forever"
      ] as string[],
      correctAnswer: 2,
      order: 5
    });

    // Create assignment
    this.createAssignment({
      courseId: 1,
      title: "Programming Quiz",
      description: "Test your knowledge of programming concepts",
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000) // Due tomorrow
    });
  }
}

export const storage = new MemStorage();
