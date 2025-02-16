import React, { SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { AnswerState } from "../pages/TakeLesson";
import { Button, Checkbox } from "@gravity-ui/uikit";
// import { useCreateClientTestSubmissionMutation } from "../hooks/mutations/create-client-test-sub";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCreateTestSubmissionMutation } from "../hooks/mutations/create-client-test-sub";

interface IProps {
  answers: AnswerState[];
  setAnswers: React.Dispatch<SetStateAction<AnswerState[]>>;
  questions: {
    id: number;
    question: string;
    answers: {
      id: number;
      answer: string;
    }[];
  }[];
  setError: React.Dispatch<SetStateAction<string>>;
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
}

const TestingComponent: React.FC<IProps> = ({ answers, setAnswers, questions, setError, setIsOpen }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const createTestSubscription = useCreateTestSubmissionMutation({
    onSuccess: (data) => {
      console.log(data);
      navigate(
        `/completedtest?course_id=${searchParams.get("course_id") || ""}&tid=${searchParams.get(
          "id"
        )}&type=${searchParams.get("type")}&req=${data?.passing_score}&res=${data?.user_score}&max=${
          data?.max_score
        }&ret=${data?.retries_left}`
      );
    },
    onError: (error: any) => {
      setError(error?.response?.data?.error);
      setIsOpen(true);
    },
  });

  const handleCheckboxChange = (questionId: number, answerId: number) => {
    setAnswers((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          // If question ID matches, update the answers array
          const answerIndex = q.answers.indexOf(answerId);

          if (answerIndex !== -1) {
            // Answer already exists, remove it
            return { ...q, answers: q.answers.filter((id) => id !== answerId) };
          } else {
            // Add answer
            return { ...q, answers: [...q.answers, answerId] };
          }
        }
        // Return other questions unchanged
        return q;
      })
    );
  };

  const handleSubmitTest = () => {
    let err = 0;
    setAnswers((prev) =>
      prev?.map((ques) => {
        let error = "";
        if (ques?.answers?.length === 0) {
          err++;
          error = t("cl_courses.answer");
        }
        return { ...ques, error };
      })
    );

    if (err > 0) return;

    createTestSubscription.mutate({
      questions: answers,
      prog_id: searchParams.get("id"),
      sub_id: searchParams.get("course_id"),
    });
  };

  return (
    <>
      {questions?.map((question, index) => {
        const err = answers?.find((q) => q.id === question?.id)?.error;
        return (
          <div key={question?.question + index} className="w-[570px] bg-white rounded-3xl p-6 flex gap-4 relative">
            <h1 className="text-st font-semibold">{index + 1}.</h1>
            <div className="flex flex-col gap-4 w-full">
              <h1 className="text-st font-semibold text-black text-wrap">{question?.question}</h1>
              <div className="flex flex-col gap-2">
                {question?.answers?.map((answer, aIndex) => {
                  const selected = answers?.find((q) => q.id === question?.id)?.answers.includes(answer?.id) || false;
                  return (
                    <button
                      type="button"
                      key={answer?.answer + aIndex}
                      onClick={() => handleCheckboxChange(question?.id, answer?.id)}
                      className={`flex duration-300 items-center gap-2 p-3 rounded-xl border border-transparent bg-primarylight ${
                        selected && "!border-iconorange"
                      }`}
                    >
                      <Checkbox checked={selected} />
                      <p className="text-ft font-normal text-textblack">{answer?.answer}</p>
                    </button>
                  );
                })}
              </div>
              {err && <p className="text-errorred text-ft font-normal">{err}</p>}
            </div>
          </div>
        );
      })}
      <div className="p-4 bg-white rounded-2xl">
        <Button className="w-full" view="action" type="button" onClick={handleSubmitTest} size="xl">
          {t("cl_courses.sub")}
        </Button>
      </div>
    </>
  );
};

export default TestingComponent;
