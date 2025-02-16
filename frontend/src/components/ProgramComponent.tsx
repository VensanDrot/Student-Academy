import React, { SetStateAction } from "react";
import { Button, Checkbox, TextArea, TextInput } from "@gravity-ui/uikit";
import { FileUpload, UploadedFile } from "./FileUpload";
import ProgressBar from "./ProgressBar";
import { useTranslation } from "react-i18next";
import { LoadingBar, ProgramAnswer, ProgramBuild, ProgramBuildErrors, ProgramQuestion } from "../constants/types";
import { ReactComponent as Bin } from "../img/bin.svg";
import { ReactComponent as Plus } from "../img/plus.svg";
import { UseMutationResult } from "@tanstack/react-query";
import { CourseRes } from "../hooks/mutations/create-course";

interface IProps {
  type: number;
  program: ProgramBuild;
  topText: string;
  programs: ProgramBuild[];
  loadingBar: LoadingBar;
  currentProgram: number;
  courseId: number | string;
  createProgramLessonMutation: UseMutationResult<any, any, any, any>;
  updateProgramLessonMutation: UseMutationResult<any, any, any, any>;
  createTestLessonMutation: UseMutationResult<any, any, any, any>;
  updateTestLessonMutation: UseMutationResult<any, any, any, any>;
  delFunction?: (item: any) => void;
  setPrograms: React.Dispatch<SetStateAction<ProgramBuild[]>>;
  courseRetrieve: CourseRes;
}

const ProgramComponent: React.FC<IProps> = ({
  type,
  program,
  topText,
  loadingBar,
  programs,
  currentProgram,
  courseId,
  createProgramLessonMutation,
  updateProgramLessonMutation,
  createTestLessonMutation,
  updateTestLessonMutation,
  delFunction,
  setPrograms,
  courseRetrieve,
}) => {
  const { t } = useTranslation();

  //delete question for Program type 2
  const deleteQuestion = (questionIndex: number) => {
    setPrograms((prevPrograms) =>
      prevPrograms.map((program, index) =>
        index === currentProgram // Check if this is the current program
          ? {
              ...program,
              removeQuestion: [...(program?.removeQuestion || []), Number(program?.questions[questionIndex]?.id)],
              questions: program?.questions?.filter((_, qIndex) => qIndex !== questionIndex), // Remove the question by index
            }
          : program
      )
    );
  };

  //add question
  const addQuestion = () => {
    setPrograms((prevPrograms) =>
      prevPrograms.map((program, index) =>
        index === currentProgram
          ? {
              ...program,
              questions: [
                ...(program.questions || []),
                {
                  question: "",
                  answers: [{ answer: "", isTrue: false }],
                },
              ],
              errors: {
                ...program.errors,
                questions: [
                  ...(program.errors.questions || []),
                  {
                    question: "",
                    answers: [],
                  },
                ],
              },
            }
          : program
      )
    );
  };

  //delete answer for question Program type 2
  const deleteAnswerOption = (questionIndex: number, answerIndex: number) => {
    setPrograms((prevPrograms) =>
      prevPrograms.map((program, index) =>
        index === currentProgram // Check if this is the current program
          ? {
              ...program,
              removeAnswer: [
                ...(program?.removeAnswer || []),
                Number(program?.questions[questionIndex].answers[answerIndex]?.id),
              ],
              questions: program.questions.map((question, qIndex) =>
                qIndex === questionIndex // Check if this is the correct question
                  ? {
                      ...question,
                      answers: question.answers.filter((_, aIndex) => aIndex !== answerIndex), // Remove the answer by index
                    }
                  : question
              ),
            }
          : program
      )
    );
  };

  //add answer for question Program type 2
  const addAnswerOption = (questionIndex: number) => {
    setPrograms((prevPrograms) =>
      prevPrograms.map((program, index) =>
        index === currentProgram // Check if this is the current program
          ? {
              ...program,
              questions: program.questions.map((question, qIndex) =>
                qIndex === questionIndex // Check if this is the correct question
                  ? {
                      ...question,
                      answers: [
                        ...question.answers,
                        { answer: "", isTrue: false }, // Add a new empty answer object
                      ],
                    }
                  : question
              ),
            }
          : program
      )
    );
  };

  const addFileIndexToRemove = (item: any) => {
    if (!item?.id) return;
    setPrograms((prevPrograms) =>
      prevPrograms?.map((program, index) =>
        index === currentProgram // Check if this is the current program
          ? {
              ...program,
              removeFiles: [...(program?.removeFiles || []), Number(item?.id)],
            }
          : program
      )
    );
  };

  //handle files
  const setFiles = (files: UploadedFile[]) => {
    setPrograms((prevPrograms) =>
      prevPrograms.map((program, index) => (index === currentProgram ? { ...program, files: files as any } : program))
    );
  };

  //handle text fields
  const inputHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    id?: string,
    value?: boolean | number | string
  ) => {
    const keys = id?.split(".") || e.target.id.split(".") || []; // Split the id into keys (e.g., "questions[0].answers[1].isTrue")

    setPrograms((prevPrograms) =>
      prevPrograms.map((program, index) => {
        if (index === currentProgram) {
          // Create a deep copy of the program
          const updatedProgram = { ...program } as ProgramBuild;

          // Traverse the keys to reach the target
          let target: any = updatedProgram;
          for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            const match = key?.match(/(.+)\[(\d+)\]/); // Match array indices

            if (match) {
              const arrayKey = match[1];
              const arrayIndex = parseInt(match[2], 10);

              if (!Array.isArray(target[arrayKey])) {
                target[arrayKey] = [];
              }

              if (!target[arrayKey][arrayIndex]) {
                target[arrayKey][arrayIndex] = {};
              }

              target = target[arrayKey][arrayIndex];
            } else {
              if (!target[key]) {
                target[key] = {};
              }
              target = target[key];
            }
          }

          // Update the final key
          const lastKey = keys[keys.length - 1];
          const match = lastKey?.match(/(.+)\[(\d+)\]/);

          if (match) {
            const arrayKey = match[1];
            const arrayIndex = parseInt(match[2], 10);

            if (!Array.isArray(target[arrayKey])) {
              target[arrayKey] = [];
            }

            target[arrayKey][arrayIndex] = value ?? e.target.value;
          } else {
            target[lastKey] = value ?? e.target.value;
          }

          return updatedProgram;
        }
        return program;
      })
    );
  };

  //create program for course
  const handleForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const programToSubmit = programs[currentProgram];
    let err = 0;
    let obj = {} as any;

    if (programToSubmit?.id) {
      const correspondingProgram = courseRetrieve?.data?.programs.find(
        (program) => program?.id?.toString() === programToSubmit?.id?.toString()
      ) as any;

      if (programToSubmit?.type === 1) {
        updateError("", "name");
        updateError("", "description");
        updateError("", "files");

        if (programToSubmit?.name !== correspondingProgram?.name) {
          if (programToSubmit?.name?.trim().length === 0) {
            err++;
            updateError(t("course.name_error_lesson"), "name");
          }
          obj["name"] = programToSubmit?.name;
        }

        if (programToSubmit?.description !== correspondingProgram?.description) {
          if (programToSubmit?.description?.trim().length === 0) {
            err++;
            updateError(t("course.description_error_lesson"), "description");
          }
          obj["description"] = programToSubmit?.description;
        }

        obj["files"] = programToSubmit?.files?.filter((file: any) => !file?.id && file);
        obj["remove_files"] = programToSubmit?.removeFiles;

        if (err > 0) return;

        obj["type"] = programToSubmit?.type;
        obj["program_id"] = programToSubmit?.id;

        updateProgramLessonMutation.mutate(obj);
      }
      //edit tests
      if (programToSubmit?.type === 2) {
        updateError("", "name");
        updateError("", "rewardScore");
        updateError("", "passingScore");
        programToSubmit?.questions?.forEach((question, indexQuestion) => {
          updateError("", "questions", indexQuestion);
          question?.answers?.forEach((answer, index) => {
            updateError("", "questions", indexQuestion, index);
          });
        });

        if (programToSubmit?.name !== correspondingProgram?.name) {
          if (programToSubmit?.name?.trim()?.length === 0) {
            err++;
            updateError(t("course.name_error_lesson"), "name");
          }
          obj["name"] = programToSubmit?.name;
        }

        if (programToSubmit?.rewardScore !== correspondingProgram?.test?.reward_score) {
          if (programToSubmit?.rewardScore?.trim()?.length === 0) {
            err++;
            updateError(t("course.reward_score_test"), "rewardScore");
          }
          obj["reward_score"] = programToSubmit?.rewardScore;
        }

        if (programToSubmit?.passingScore !== correspondingProgram?.test?.passing_score) {
          if (programToSubmit?.passingScore?.trim()?.length === 0) {
            err++;
            updateError(t("course.passing_score_test"), "passingScore");
          }
          obj["passing_score"] = programToSubmit?.passingScore;
        }

        /// Step 1: Add new questions
        const newQuestions = programToSubmit?.questions
          ?.map((question: any, indexQuestion: number) => {
            if (question?.id) return;
            if (!question?.question?.trim()) {
              err++;
              updateError(t("course.question_test"), "questions", indexQuestion);
            }

            question?.answers?.forEach((answer: any, index: number) => {
              if (!answer?.answer?.trim()) {
                err++;
                updateError(t("course.question_answer_test"), "questions", indexQuestion, index);
              }
            });

            return {
              question: question?.question,
              answers: question?.answers?.map((answer: any) => ({
                answer: answer?.answer,
                is_true: answer?.isTrue,
              })),
            };
          })
          .filter(Boolean);

        if (newQuestions?.length > 0) {
          obj.questions = obj.questions || [];
          obj.questions.push(...newQuestions);
        }

        // Step 2: Compare and update old questions
        programToSubmit?.questions?.forEach((question, indexQuestion) => {
          if (!question?.id) return; // Skip new questions, already handled above

          const correspondingQuestion = correspondingProgram?.test?.questions?.find((q: any) => q.id === question.id);

          const updatedQuestion = {
            id: question?.id || null,
            question: question?.question,
            answers: [] as any,
          };

          // Check if question text has changed
          let questionChanged = false;
          if (!correspondingQuestion || question?.question !== correspondingQuestion?.question) {
            questionChanged = true;

            if (!question?.question?.trim()) {
              err++;
              updateError(t("course.question_test"), "questions", indexQuestion);
            }
          }

          // Check if any answers have changed
          let answersChanged = false;
          question?.answers?.forEach((answer, index) => {
            const correspondingAnswer = correspondingQuestion?.answers?.[index];

            if (
              !correspondingAnswer ||
              answer?.answer !== correspondingAnswer?.answer ||
              answer?.isTrue !== correspondingAnswer?.is_true
            ) {
              answersChanged = true;

              if (!answer?.answer?.trim()) {
                err++;
                updateError(t("course.question_answer_test"), "questions", indexQuestion, index);
              }

              updatedQuestion.answers.push({
                id: answer?.id || null,
                answer: answer?.answer,
                is_true: answer?.isTrue,
              });
            }
          });

          // Add the updated question to obj.questions if any changes were made
          if (questionChanged || answersChanged) {
            obj.questions = obj.questions || [];
            obj.questions.push(updatedQuestion);
          }
        });

        obj["remove_answer"] = programToSubmit?.removeAnswer;
        obj["remove_question"] = programToSubmit?.removeQuestion;

        if (err > 0) return;

        obj["type"] = programToSubmit?.type;
        obj["id"] = programToSubmit?.id;

        updateTestLessonMutation.mutate(obj);
      }
    }
    // creating a new program
    else {
      if (programToSubmit?.type === 1) {
        updateError("", "name");
        updateError("", "description");
        updateError("", "files");

        if (programToSubmit?.name?.trim().length === 0) {
          err++;
          updateError(t("course.name_error_lesson"), "name");
        }

        if (programToSubmit?.description?.trim().length === 0) {
          err++;
          updateError(t("course.description_error_lesson"), "description");
        }

        if (programToSubmit?.files?.length === 0) {
          err++;
          updateError(t("course.files_error_lesson"), "files");
        }

        if (err > 0) return;

        createProgramLessonMutation.mutate({
          name: programToSubmit?.name,
          type: programToSubmit?.type,
          files: programToSubmit?.files,
          description: programToSubmit?.description,
          order: programToSubmit?.order,
          course_id: courseId,
        });
      }

      if (programToSubmit?.type === 2) {
        updateError("", "name");
        updateError("", "rewardScore");
        updateError("", "passingScore");
        programToSubmit?.questions?.forEach((question, indexQuestion) => {
          updateError("", "questions", indexQuestion);
          question?.answers?.forEach((answer, index) => {
            updateError("", "questions", indexQuestion, index);
          });
        });

        if (programToSubmit?.name?.trim()?.length === 0) {
          err++;
          updateError(t("course.name_error_lesson"), "name");
        }

        if (programToSubmit?.rewardScore?.trim()?.length === 0) {
          err++;
          updateError(t("course.reward_score_test"), "rewardScore");
        }

        if (programToSubmit?.passingScore?.trim()?.length === 0) {
          err++;
          updateError(t("course.passing_score_test"), "passingScore");
        }

        programToSubmit?.questions?.forEach((question, indexQuestion) => {
          if (question?.question?.trim()?.length === 0) {
            err++;
            updateError(t("course.question_test"), "questions", indexQuestion);
          }
          question?.answers?.forEach((answer, index) => {
            if (answer?.answer?.trim()?.length === 0) {
              err++;
              updateError(t("course.question_answer_test"), "questions", indexQuestion, index);
            }
          });
        });

        if (err > 0) return;

        createTestLessonMutation.mutate({
          course_id: courseId,
          name: programToSubmit?.name,
          type: programToSubmit?.type,
          order: Number(programToSubmit?.order),
          reward_score: Number(programToSubmit?.rewardScore),
          passing_score: Number(programToSubmit?.passingScore),
          questions: [
            ...programToSubmit?.questions?.map((question) => ({
              question: question?.question,
              answers: [...question?.answers?.map((answer) => ({ answer: answer?.answer, is_true: answer?.isTrue }))],
            })),
          ],
        });
      }
    }
  };

  const updateError = (
    errorText: string, // The error message
    field: keyof ProgramBuildErrors, // Top-level field or nested field to update
    questionIndex?: number, // Index of the question or criteria, if applicable
    answerIndex?: number // Index of the answer, if applicable
  ) => {
    setPrograms((prevPrograms) =>
      prevPrograms.map((program, programIndex) => {
        if (programIndex === currentProgram) {
          // Deep copy of the program and its errors
          const updatedProgram = { ...program, errors: { ...program.errors } };

          if (field === "questions" && questionIndex !== undefined) {
            // Handle question-related errors
            if (!updatedProgram.errors.questions[questionIndex]) {
              updatedProgram.errors.questions[questionIndex] = { question: "", answers: [] };
            }

            if (answerIndex !== undefined) {
              // Handle answer-level error
              if (!updatedProgram.errors.questions[questionIndex].answers[answerIndex]) {
                updatedProgram.errors.questions[questionIndex].answers[answerIndex] = { answer: "", isTrue: false };
              }

              // Update the specific answer error
              updatedProgram.errors.questions[questionIndex].answers[answerIndex].answer = errorText;
            } else {
              // Update the question-level error
              updatedProgram.errors.questions[questionIndex].question = errorText;
            }
          } else {
            // Update top-level fields
            updatedProgram.errors[field] = errorText as any;
          }

          return updatedProgram;
        }
        return program;
      })
    );
  };

  const choseTheLayout = () => {
    switch (type) {
      case 1:
        return (
          <form id="programform" onSubmit={handleForm} className="flex flex-col gap-5 w-full bg-white rounded-3xl p-6">
            {loadingBar.active && (
              <ProgressBar
                current={loadingBar?.current}
                percentage={loadingBar?.percentage}
                totalFiles={loadingBar?.totalFiles}
                totalSize={loadingBar?.totalSize}
                uploadedSize={loadingBar?.uploadedSize}
                onClick={() => {}}
              />
            )}
            <FileUpload
              files={program?.files}
              setFiles={setFiles}
              error={program.errors?.files}
              textEmpty={t("course.no_pics")}
              delFunction={(item: any) => {
                addFileIndexToRemove(item);
                delFunction && delFunction(item);
              }}
            />
            <div className="flex flex-col gap-1">
              <p className="text-ft font-normal text-textlightgrey">{t("course.lesson_name")}</p>
              <TextInput
                id="name"
                value={program?.name}
                type="text"
                size="xl"
                onChange={inputHandler}
                validationState={program.errors?.name ? "invalid" : undefined}
                errorMessage={program.errors?.name}
              />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-ft font-normal text-textlightgrey">{t("course.lesson_description")}</p>
              <TextArea
                id="description"
                value={program.description}
                size="xl"
                minRows={5}
                onChange={inputHandler}
                validationState={program.errors?.description ? "invalid" : undefined}
                errorMessage={program.errors?.description}
              />
            </div>
          </form>
        );

      case 2:
        return (
          <form id="programform" onSubmit={handleForm} className="flex flex-col gap-5 w-full bg-tranperent">
            <div className="flex flex-col gap-4 bg-white p-6 rounded-3xl">
              <div className="flex flex-col gap-2">
                <p className="text-ft font-normal text-textlightgrey">{t("course.test_name")}</p>
                <TextInput
                  id="name"
                  value={program?.name}
                  type="text"
                  size="xl"
                  onChange={inputHandler}
                  validationState={program.errors?.name ? "invalid" : undefined}
                  errorMessage={program.errors?.name}
                />
              </div>
              <div className="flex gap-2 items-end">
                <div className="flex flex-col gap-1 w-full">
                  <p className="text-ft font-normal text-textlightgrey">{t("course.correct_answer")}</p>
                  <TextInput
                    id="rewardScore"
                    value={program?.rewardScore}
                    type="text"
                    size="xl"
                    onChange={(e) => inputHandler(e, e.target.id, e.target.value.replace(/[^\d.]/g, ""))}
                    validationState={program.errors?.rewardScore ? "invalid" : undefined}
                    errorMessage={program.errors?.rewardScore}
                  />
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <p className="text-ft font-normal text-textlightgrey">{t("course.req_points")}</p>
                  <TextInput
                    id="passingScore"
                    value={program?.passingScore}
                    type="text"
                    size="xl"
                    onChange={(e) => inputHandler(e, e.target.id, e.target.value.replace(/[^\d.]/g, ""))}
                    validationState={program.errors?.passingScore ? "invalid" : undefined}
                    errorMessage={program.errors?.passingScore}
                  />
                </div>
              </div>
            </div>

            {program?.questions?.map((question: ProgramQuestion, questionIndex: number) => (
              <div className="flex flex-col gap-4 bg-white p-6 rounded-3xl" key={`${questionIndex}`}>
                <div className="flex justify-between items-center">
                  <p className="text-st font-semibold">№{questionIndex + 1}</p>
                  <button
                    type="button"
                    onClick={() => deleteQuestion(questionIndex)}
                    className="text-ft font-normal text-errorred"
                  >
                    {t("course.delete")}
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-ft font-normal text-textlightgrey">{t("course.question")}</p>
                  <TextArea
                    id={`questions[${questionIndex}].question`}
                    value={question?.question}
                    size="xl"
                    className="text-wrap flex-wrap"
                    onChange={inputHandler}
                    validationState={program.errors?.questions?.[questionIndex]?.question ? "invalid" : undefined}
                    errorMessage={program.errors?.questions?.[questionIndex]?.question}
                  />
                </div>
                <p className="text-ft font-normal text-textlightgrey">{t("course.options")}</p>
                {question?.answers?.map((answer: ProgramAnswer, index: number) => (
                  <div className="flex gap-2" key={`${index}`}>
                    <div className="p-2 px-4 w-12 flex justify-center items-center bg-[#0000000D] rounded-xl">
                      <Checkbox
                        size="l"
                        checked={answer?.isTrue}
                        onChange={(e) =>
                          inputHandler(e, `questions[${questionIndex}].answers[${index}].isTrue`, !answer?.isTrue)
                        }
                      />
                    </div>
                    <div className="p-2 px-4 pr-6 flex gap-5 justify-center items-center bg-[#0000000D] w-full rounded-xl">
                      <TextArea
                        id={`questions[${questionIndex}].answers[${index}].answer`}
                        value={answer?.answer}
                        size="xl"
                        className="text-wrap flex-wrap [&>span>textarea]:bg-white rounded-xl"
                        onChange={inputHandler}
                        validationState={
                          program.errors?.questions?.[questionIndex]?.answers?.[index]?.answer ? "invalid" : undefined
                        }
                        errorMessage={program.errors?.questions?.[questionIndex]?.answers?.[index]?.answer}
                      />
                      <button type="button" onClick={() => deleteAnswerOption(questionIndex, index)}>
                        <Bin className="fill-icongray w-5 h-5 " />
                      </button>
                    </div>
                  </div>
                ))}

                <div className="flex gap-2">
                  <div className=" w-12"></div>
                  <Button view="normal" size="xl" onClick={() => addAnswerOption(questionIndex)} className="w-full">
                    {t("course.add_option")}
                  </Button>
                </div>
              </div>
            ))}
            <div className="flex flex-col gap-4 bg-white p-6 rounded-3xl">
              <Button
                view="normal"
                size="xl"
                onClick={() => addQuestion()}
                className="w-full [&>span]:flex [&>span]:gap-2 [&>span]:items-center"
              >
                {t("course.add_question")}
                <Plus className="fill-black" />
              </Button>
            </div>
          </form>
        );
    }
  };

  return (
    <div className="flex flex-col gap-5 w-[100%] max-w-[850px] rounded-3xl overflow-x-hidden h-fit">
      <div className="flex justify-between gap-6 items-center w-full bg-white rounded-3xl p-4">
        <h1 className="text-ft font-semibold">{topText}</h1>
        <Button type="submit" extraProps={{ form: "programform" }} size="l" view="action">
          {t("admin_users.save_change")}
        </Button>
      </div>
      {choseTheLayout()}
    </div>
  );
};

export default ProgramComponent;
