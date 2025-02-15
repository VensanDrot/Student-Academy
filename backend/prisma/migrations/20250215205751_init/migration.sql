-- CreateTable
CREATE TABLE "Categories" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT DEFAULT '',

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Courses" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT DEFAULT '',
    "description" TEXT DEFAULT '',
    "cost" DECIMAL(10,2),
    "category" INTEGER,
    "activated" BOOLEAN DEFAULT true,
    "author" INTEGER,

    CONSTRAINT "Courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoursesFiles" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "course_id" INTEGER,
    "file_type" TEXT DEFAULT '',
    "file_name" TEXT DEFAULT '',
    "file_path" TEXT DEFAULT '',

    CONSTRAINT "CoursesFiles_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Courses" ADD CONSTRAINT "Courses_author_fkey" FOREIGN KEY ("author") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Courses" ADD CONSTRAINT "Courses_category_fkey" FOREIGN KEY ("category") REFERENCES "Categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CoursesFiles" ADD CONSTRAINT "CoursesFiles_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
