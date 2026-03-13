#include <iostream>
#include <string>
using namespace std;

class Person
{
public:
    string name;

    Person()
    {
        name = "";
    }

    virtual void showMenu() {}
};

class Question
{
public:
    string text;
    string options[4];
    int correctAnswer;

    Question()
    {
        text = "";
        correctAnswer = 1;
    }
};

class User : public Person
{
public:
    int score;
    int correct;
    int wrong;
    int points;
    bool hasAttempted;

    User()
    {
        score = 0;
        correct = 0;
        wrong = 0;
        points = 0;
        hasAttempted = false;
    }
};

class QuizGame
{
public:
    Question ques[30];
    int total;

    QuizGame()
    {
        ques[0].text = "5+7=?";
        ques[0].options[0] = "10";
        ques[0].options[1] = "12";
        ques[0].options[2] = "13";
        ques[0].options[3] = "15";
        ques[0].correctAnswer = 2;

        ques[1].text = "SquareRootOf16?";
        ques[1].options[0] = "2";
        ques[1].options[1] = "4";
        ques[1].options[2] = "8";
        ques[1].options[3] = "16";
        ques[1].correctAnswer = 2;

        ques[2].text = "9x3=?";
        ques[2].options[0] = "27";
        ques[2].options[1] = "21";
        ques[2].options[2] = "24";
        ques[2].options[3] = "30";
        ques[2].correctAnswer = 1;

        ques[3].text = "Ifx=5,2x+3=?";
        ques[3].options[0] = "13";
        ques[3].options[1] = "10";
        ques[3].options[2] = "15";
        ques[3].options[3] = "20";
        ques[3].correctAnswer = 1;

        ques[4].text = "15/3=?";
        ques[4].options[0] = "3";
        ques[4].options[1] = "5";
        ques[4].options[2] = "6";
        ques[4].options[3] = "10";
        ques[4].correctAnswer = 2;

        ques[5].text = "CapitalOfIndia?";
        ques[5].options[0] = "Mumbai";
        ques[5].options[1] = "Delhi";
        ques[5].options[2] = "Kolkata";
        ques[5].options[3] = "Chennai";
        ques[5].correctAnswer = 2;

        ques[6].text = "DaysInWeek?";
        ques[6].options[0] = "5";
        ques[6].options[1] = "6";
        ques[6].options[2] = "7";
        ques[6].options[3] = "8";
        ques[6].correctAnswer = 3;

        ques[7].text = "2x5=?";
        ques[7].options[0] = "8";
        ques[7].options[1] = "10";
        ques[7].options[2] = "12";
        ques[7].options[3] = "15";
        ques[7].correctAnswer = 2;

        ques[8].text = "KingOfJungle?";
        ques[8].options[0] = "Tiger";
        ques[8].options[1] = "Lion";
        ques[8].options[2] = "Elephant";
        ques[8].options[3] = "Bear";
        ques[8].correctAnswer = 2;

        ques[9].text = "20/4=?";
        ques[9].options[0] = "4";
        ques[9].options[1] = "5";
        ques[9].options[2] = "6";
        ques[9].options[3] = "8";
        ques[9].correctAnswer = 2;

        total = 10;
    }

    void startQuiz(User &student)
    {
        int c = 0, w = 0;

        cout << "\nStarting Quiz for " << student.name << endl;

        for (int i = 0; i < total; i++)
        {
            cout << "\nQuestion " << i + 1 << ": " << ques[i].text << endl;
            for (int j = 0; j < 4; j++)
            {
                cout << j + 1 << ". " << ques[i].options[j] << endl;
            }

            int ans;
            cout << "Your answer (1-4): ";
            cin >> ans;

            if (ans < 1 || ans > 4)
            {
                cout << "Invalid! Taking 0 as answer" << endl;
                ans = 0;
            }

            if (ans == ques[i].correctAnswer)
            {
                cout << "Correct!" << endl;
                c++;
            }
            else
            {
                cout << "Wrong! Correct answer: "
                     << ques[i].options[ques[i].correctAnswer - 1] << endl;
                w++;
            }
        }

        student.correct = c;
        student.wrong = w;
        student.score = (c * 100) / total;

        if (student.score >= 90)
            student.points = 200;
        else if (student.score >= 75)
            student.points = 150;
        else if (student.score >= 60)
            student.points = 100;
        else if (student.score >= 40)
            student.points = 50;
        else
            student.points = 25;

        student.hasAttempted = true;

        cout << "\nQuiz Complete!" << endl;
        cout << "Name: " << student.name << endl;
        cout << "Score: " << student.score << "%" << endl;
        cout << "Correct: " << student.correct << endl;
        cout << "Wrong: " << student.wrong << endl;
        cout << "Points Earned: " << student.points << endl;
    }

    void addNewQuestion()
    {
        if (total >= 30)
        {
            cout << "Cannot add more questions" << endl;
            return;
        }

        string q, o1, o2, o3, o4;
        int ans;

        cout << "\nEnter question: ";
        cin >> q;
        cout << "Option 1:\n ";
        cin >> o1;
        cout << "Option 2: \n";
        cin >> o2;
        cout << "Option 3:\n ";
        cin >> o3;
        cout << "Option 4: \n";
        cin >> o4;
        cout << "Correct answer (1-4):\n ";
        cin >> ans;

        if (ans < 1 || ans > 4)
        {
            cout << "Invalid answer! Setting to 1" << endl;
            ans = 1;
        }

        ques[total].text = q;
        ques[total].options[0] = o1;
        ques[total].options[1] = o2;
        ques[total].options[2] = o3;
        ques[total].options[3] = o4;
        ques[total].correctAnswer = ans;

        total++;
        cout << "\nQuestion added! Total questions now: " << total << endl;
    }

    void editQuestion()
    {
        if (total == 0)
        {
            cout << "No questions available" << endl;
            return;
        }

        int num;
        cout << "Which question to edit? (1 - " << total << "): ";
        cin >> num;

        if (num < 1 || num > total)
        {
            cout << "Invalid number" << endl;
            return;
        }

        string q, o1, o2, o3, o4;
        int ans;

        cout << "Enter new question: ";
        cin >> q;
        cout << "Option 1: ";
        cin >> o1;
        cout << "Option 2: ";
        cin >> o2;
        cout << "Option 3: ";
        cin >> o3;
        cout << "Option 4: ";
        cin >> o4;
        cout << "Correct answer (1-4): ";
        cin >> ans;

        if (ans < 1 || ans > 4)
        {
            cout << "Invalid answer! Setting to 1" << endl;
            ans = 1;
        }

        ques[num - 1].text = q;
        ques[num - 1].options[0] = o1;
        ques[num - 1].options[1] = o2;
        ques[num - 1].options[2] = o3;
        ques[num - 1].options[3] = o4;
        ques[num - 1].correctAnswer = ans;

        cout << "Question updated!" << endl;
    }

    void showQuestions()
    {
        if (total == 0)
        {
            cout << "No questions found" << endl;
            return;
        }

        cout << "\nAll Questions:" << endl;
        for (int i = 0; i < total; i++)
        {
            cout << "\n"
                 << i + 1 << ". " << ques[i].text << endl;
            for (int j = 0; j < 4; j++)
            {
                cout << "   " << j + 1 << ". " << ques[i].options[j] << endl;
            }
            cout << "   Answer: " << ques[i].correctAnswer << endl;
        }
        cout << "\nTotal: " << total << " questions" << endl;
    }
};

class Admin : public Person
{
public:
    string user;
    string pass;

    Admin()
    {
        user = "admin";
        pass = "1234";
        name = "Administrator";
    }

    bool login()
    {
        string u, p;
        cout << "\nUsername: ";
        cin >> u;
        cout << "Password: ";
        cin >> p;

        if (u == user && p == pass)
        {
            cout << "Login successful" << endl;
            return true;
        }
        cout << "Invalid credentials" << endl;
        return false;
    }

    void showMenu(QuizGame &game, User students[], int count)
    {
        int ch;
        do
        {
            cout << "\nAdmin Panel" << endl;
            cout << "1. View All Questions" << endl;
            cout << "2. Add New Question" << endl;
            cout << "3. Edit Question" << endl;
            cout << "4. View Student Results" << endl;
            cout << "5. Logout" << endl;
            cout << "Choice: ";
            cin >> ch;

            if (ch == 1)
            {
                game.showQuestions();
            }
            else if (ch == 2)
            {
                game.addNewQuestion();
            }
            else if (ch == 3)
            {
                game.editQuestion();
            }
            else if (ch == 4)
            {
                cout << "\nStudent Results:" << endl;
                if (count == 0)
                {
                    cout << "No students yet" << endl;
                }
                else
                {
                    int attempted = 0;
                    for (int i = 0; i < count; i++)
                    {
                        if (students[i].hasAttempted)
                        {
                            attempted++;
                            cout << "\nStudent " << attempted << endl;
                            cout << "Name: " << students[i].name << endl;
                            cout << "Score: " << students[i].score << "%" << endl;
                            cout << "Correct: " << students[i].correct << endl;
                            cout << "Wrong: " << students[i].wrong << endl;
                            cout << "Points: " << students[i].points << endl;
                        }
                    }
                    if (attempted > 0)
                    {
                        cout << "\nTotal students: " << attempted << endl;
                    }
                }
            }
            else if (ch == 5)
            {
                cout << "Logging out" << endl;
            }
            else
            {
                cout << "Invalid choice" << endl;
            }
        } while (ch != 5);
    }
};

int main()
{
    QuizGame game;
    User students[50];
    int studentCount = 0;
    Admin admin;

    cout << "\nLEARNIFY QUIZ SYSTEM" << endl;

    int choice;
    do
    {
        cout << "\nMain Menu" << endl;
        cout << "1. Admin Login" << endl;
        cout << "2. Student Login" << endl;
        cout << "3. Exit" << endl;
        cout << "Enter choice: ";
        cin >> choice;

        if (choice == 1)
        {
            if (admin.login())
            {
                admin.showMenu(game, students, studentCount);
            }
        }
        else if (choice == 2)
        {
            if (studentCount >= 50)
            {
                cout << "Maximum students reached" << endl;
            }
            else
            {
                string name;
                cout << "\nEnter your name: ";
                cin >> name;

                students[studentCount].name = name;
                game.startQuiz(students[studentCount]);
                studentCount++;

                cout << "\nThank you " << name << "!" << endl;
            }
        }
        else if (choice == 3)
        {
            cout << "\nThank you for using Learnify" << endl;
            cout << "Total students: " << studentCount << endl;
        }
        else
        {
            cout << "Invalid choice" << endl;
        }
    } while (choice != 3);

    return 0;
}
