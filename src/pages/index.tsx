import { Box, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
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

export default function Home() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [gpa, setGpa] = useState<number>(0)
  const [getCredits, setGetCredits] = useState<number>(0)
  const [detail, setDetail] = useState<number[]>([0,0,0,0,0])
  const [subGpa, setSubGpa] = useState<number>(0)
  const [subGetCredits, setSubGetCredits] = useState<number>(0)
  const [subDetail, setSubDetail] = useState<number[]>([0,0,0,0,0])
  const [year, setYear] = useState<number>(2022)
  const [semester, setSemester] = useState<string>("後期,後期前半,後期後半")

  const router = useRouter()

  const point2gpa = (point :number) => {
    if (4<point && point<60) return 0
    else if (60<=point && point<70) return 1
    else if (70<=point && point<80) return 2
    else if (80<=point && point<90) return 3
    else if (90<=point && point<=100) return 4
    else return -1
  }

  useEffect(() => {
    setGpa(0)
    setGetCredits(0)
    setDetail([0,0,0,0,0])
    const n = classrooms.length
    if (n == 0) return
    let evaluation: number = 0
    let credits: number = 0
    let aa: number = 0
    let a: number = 0
    let b: number = 0
    let c: number = 0
    let other: number = 0
    classrooms.map((classroom) => {
      evaluation += classroom.evaluation
      credits += classroom.credits
      if (classroom.evaluation == 4 || point2gpa(classroom.evaluation) == 4) aa += classroom.credits
      else if (classroom.evaluation == 3 || point2gpa(classroom.evaluation) == 3) a += classroom.credits
      else if (classroom.evaluation == 2 || point2gpa(classroom.evaluation) == 2) b += classroom.credits
      else if (classroom.evaluation == 1 || point2gpa(classroom.evaluation) == 1) c += classroom.credits
      else other += classroom.credits
    })
    const detail_ = [aa, a, b, c, other]
    setDetail(detail_)
    setGpa(evaluation/n)
    setGetCredits(credits)
  },[classrooms])

  useEffect(() => {
    setSubGpa(0)
    setSubGetCredits(0)
    setSubDetail([0,0,0,0,0])
    const subClassrooms: Classroom[] = []
    if (semester == "") {
      classrooms.map((classrooms) => {
        if (classrooms.year == year) {
          subClassrooms.push(classrooms)
        }
      })
    } else {
      const semesters = semester.split(",")
      classrooms.map((classroom) => {
        semesters.map((sem) => {
          if (classroom.year == year && classroom.semester == sem) {
            subClassrooms.push(classroom)
          }
        })
      })
    }
    const n = subClassrooms.length
    if (n == 0) return
    let evaluation: number = 0
    let credits: number = 0
    let aa: number = 0
    let a: number = 0
    let b: number = 0
    let c: number = 0
    let other: number = 0
    subClassrooms.map((subClassroom) => {
      evaluation += subClassroom.evaluation
      credits += subClassroom.credits
      if (subClassroom.evaluation == 4 || point2gpa(subClassroom.evaluation) == 4) aa += subClassroom.credits
      else if (subClassroom.evaluation == 3 || point2gpa(subClassroom.evaluation) == 3) a += subClassroom.credits
      else if (subClassroom.evaluation == 2 || point2gpa(subClassroom.evaluation) == 2) b += subClassroom.credits
      else if (subClassroom.evaluation == 1 || point2gpa(subClassroom.evaluation) == 1) c += subClassroom.credits
      else other += subClassroom.credits
    })
    const detail_ = [aa, a, b, c, other]
    setSubDetail(detail_)
    setSubGpa(evaluation/n)
    setSubGetCredits(credits)
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
      else if (!isNaN(Number(components[2]))) classroom_.evaluation = Number(components[2])
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

  const transEval2string = (evaluation: number) => {
    if (evaluation == 0 ) return "-"
    else if (evaluation == 1) return "C"
    else if (evaluation == 2) return "B"
    else if (evaluation == 3) return "A"
    else if (evaluation == 4) return "AA"
    else {
      if (4<evaluation && evaluation < 60) return `${evaluation}(D)`
      else if (60<=evaluation && evaluation<70) return `${evaluation}(C)`
      else if (70<=evaluation && evaluation<80) return `${evaluation}(B)`
      else if (80<=evaluation && evaluation<90) return `${evaluation}(A)`
      else if (90<=evaluation && evaluation<=100) return `${evaluation}(AA)`
      else return "-"
    }
  }

  return (
    <Box component="main">
      <Container sx={{my: 5, width: "100%"}}>
        <Box sx={{mx:  {xs: 1, md: 3}, my: 3}}>
          <Typography variant="h4">東北大学生用GPA計算(Ver.1.2)</Typography>
          <Typography variant="body2">
            学務情報システムの成績の表の中身(黄色と白の列)をすべてコピーして下に貼り付けてください。
            また、年度と期間を指定することでそれぞれのGPAを算出することができます。
            期間を指定しなければその年度の全ての科目のGPAが算出されます。
            期間は半角カンマ(&quot;,&quot;)区切りで複数入力できます。
          </Typography>
        </Box>
        <Box sx={{display: {xs: "flex", md: "none"}, mx: {xs: 1, md: 3}, my: 3, justifyContent: "center"}}>
          <Box sx={{width: "340px", "&:hover": { transform: "translateY(-1%)", opacity: 0.6}, transition: "all 0.5s"}} onClick={() => router.push("https://168style.com/16")}>
            <Image src="/168ads.png" alt="168ads" width={340} height={170}/>
          </Box>
        </Box>
        <Box sx={{display: {xs: "none", md: "flex"}, mx: {xs: 1, md: 3}, my: 3, justifyContent: "center"}}>
          <Box sx={{width: "400px", "&:hover": { transform: "translateY(-1%)", opacity: 0.6}, transition: "all 0.5s"}} onClick={() => router.push("https://168style.com/16")}>
            <Image src="/168ads.png" alt="168ads" width={400} height={200}/>
          </Box>
        </Box>
        <Box sx={{mx: {xs: 1, md: 3}, my: 3}}>
          <TextField label="成績を貼り付けてください" multiline rows={8} fullWidth onChange={handleTextChange}/>
        </Box>
        <Box sx={{mx: {xs: 1, md: 3}, my: 3, display: "flex", flexDirection: "row", justifyContent: "center"}}>
          <TextField label="年度" type="number" defaultValue={2022} onChange={handleYearChange}/>
          <TextField label="期間" defaultValue="後期,後期前半,後期後半" onChange={handleSemesterChange}/>
        </Box>
        <Box sx={{mx: {xs: 1, md: 3}, my: 3}}>
          <Typography fontWeight="bold">全学期GPA:  {Math.round(gpa*1000)/1000}</Typography>
          <Typography fontWeight="bold">全学期取得単位数:  {getCredits}</Typography>
          <Typography fontWeight="bold">AA: {detail[0]} A: {detail[1]} B: {detail[2]} C: {detail[3]} その他(Dなど): {detail[4]}</Typography>
        </Box>
        <Box sx={{mx: {xs: 1, md: 3}, my: 3}}>
          <Typography fontWeight="bold">{year}年度({semester})GPA:  {Math.round(subGpa*1000)/1000}</Typography>
          <Typography fontWeight="bold">{year}年度({semester})取得単位数:  {subGetCredits}</Typography>
          <Typography fontWeight="bold">AA: {subDetail[0]} A: {subDetail[1]} B: {subDetail[2]} C: {subDetail[3]} その他(Dなど): {subDetail[4]}</Typography>
        </Box>
        {classrooms.length != 0 && (
          <Box sx={{mx: {xs: 1, md: 3}, my: 3, overflowX: "auto"}}>
            <TableContainer sx={{minWidth: "600px"}}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>科目名</TableCell>
                    <TableCell>担当教員</TableCell>
                    <TableCell>必修/選択</TableCell>
                    <TableCell>単位数</TableCell>
                    <TableCell>成績/得点</TableCell>
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
                      <TableCell>{transEval2string(classroom.evaluation)}</TableCell>
                      <TableCell>{classroom.year}</TableCell>
                      <TableCell>{classroom.semester}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
        <Box sx={{mx: {xs: 1, md: 3}, my: 3}}>
          <Typography variant="body2">バージョン情報⬇︎</Typography>
          <Typography variant="body2">Ver.1.0: 公開しました。</Typography>
          <Typography variant="body2">Ver.1.1: 期間を&quot;,&quot;区切りで複数選択可能にしました。また、取得単位数等を表示しました。</Typography>
          <Typography variant="body2">Ver.1.2: 細かいバグを修正しました。</Typography>
        </Box>
      </Container>
    </Box>
  )
}
