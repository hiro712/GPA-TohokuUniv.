import { Box, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";

type Classroom = {
  name: string
  teacher: string
  type: string
  credits: number
  evaluation: number
  year: number
  semester: string
}

// type Subject = {
//   name: string
//   classrooms: Classroom[]
// }

// type Category = {
//   name: string
//   subjects: Subject[]
// }


export default function Home() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [gpa, setGpa] = useState<number>(0)
  const [subGpa, setSubGpa] = useState<number>(0)
  const [year, setYear] = useState<number>(2022)
  const [semester, setSemester] = useState<string>("後期")

  useEffect(() => {
    setGpa(0)
    const n = classrooms.length
    if (n == 0) return
    let evaluation: number = 0
    classrooms.map((classrooms) => {
      evaluation += classrooms.evaluation
    })
    setGpa(evaluation/n)
  },[classrooms])

  useEffect(() => {
    setSubGpa(0)
    const subClassrooms: Classroom[] = []
    if (semester == "") {
      classrooms.map((classrooms) => {
        if (classrooms.year == year) {
          subClassrooms.push(classrooms)
        }
      })
    } else {
      classrooms.map((classrooms) => {
        if (classrooms.year == year && classrooms.semester == semester) {
          subClassrooms.push(classrooms)
        }
      })
    }
    const n = subClassrooms.length
    if (n == 0) return
    let evaluation: number = 0
    subClassrooms.map((subClassroom) => {
      evaluation += subClassroom.evaluation
    })
    setSubGpa(evaluation/n)
  },[classrooms, year, semester])

  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setClassrooms([])
    const texts = event.target.value.split(/\r\n|\n/)
    texts.map((text) => {
      const rawData = text.split(/\s|\t/)
      console.log("text", text)
      const components_ = new Array<string>()
      rawData.map((data) => {
        if (!data) return
        components_.push(data)
      })

      if (components_.length == 1) return
      const components = components_.reverse()
      let classroom_: Classroom = {
        name: "",
        teacher: "",
        type: "",
        credits: 0,
        evaluation: 0,
        year: 0,
        semester: ""
      }
      classroom_.semester = components[0]
      classroom_.year = Number(components[1])
      if (components[2] == "ＡＡ") classroom_.evaluation = 4
      else if (components[2] == "Ａ") classroom_.evaluation = 3
      else if (components[2] == "Ｂ") classroom_.evaluation = 2
      else if (components[2] == "Ｃ") classroom_.evaluation = 1
      else classroom_.evaluation = 0
      classroom_.credits = Number(components[3])
      if (isNaN(classroom_.credits)) return
      classroom_.type = components[4]
      classroom_.name = components[components.length -1]
      classroom_.teacher = components[components.length -2] +" "+ components[components.length -3]
      console.log("class", classroom_)
      setClassrooms((old) => [...old, classroom_])
    })
  }

  const handleYearChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const value = Number(event.target.value)
    setYear(value)
  }
  const handleSemesterChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const value = event.target.value
    setSemester(value)
  }

  return (
    <Box component="main">
      <Container sx={{my: 5, width: "100%"}}>
        <Box sx={{m: 3}}>
          <Typography variant="h4">東北大学生用GPA計算</Typography>
          <Typography variant="body2">
            学務情報システムの成績の表の中身(黄色と白の列)をすべてコピーして下に貼り付けてください。また、年度と期間を指定することでそれぞれのGPAを算出することができます。期間を指定しなければその年度の全ての科目のGPAが算出されます。
          </Typography>
        </Box>
        <Box sx={{m: 3}}>
          <TextField label="成績を貼り付けてください" multiline rows={8} fullWidth onChange={handleTextChange}/>
        </Box>
        <Box sx={{m: 3}}>
          <TextField label="年度" type="number" defaultValue={2022} onChange={handleYearChange}/>
          <TextField label="期間" defaultValue="後期" onChange={handleSemesterChange}/>
        </Box>
        <Box sx={{m: 3}}>
          <Typography>全学期GPA: {gpa}</Typography>
          <Typography>{year}年度{semester}GPA: {subGpa}</Typography>
        </Box>
        <Box sx={{m: 3}}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>科目名</TableCell>
                  <TableCell>担当教員</TableCell>
                  <TableCell>必修/選択</TableCell>
                  <TableCell>単位数</TableCell>
                  <TableCell>成績</TableCell>
                  <TableCell>年度</TableCell>
                  <TableCell>期間</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {classrooms.map((classroom) => {
                  return (
                    <TableRow key={classroom.name}>
                      <TableCell>{classroom.name}</TableCell>
                    <TableCell>{classroom.teacher}</TableCell>
                    <TableCell>{classroom.type}</TableCell>
                    <TableCell>{classroom.credits}</TableCell>
                    <TableCell>{classroom.evaluation}</TableCell>
                    <TableCell>{classroom.year}</TableCell>
                    <TableCell>{classroom.semester}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
    </Box>
  )
}
