import React, { useState, useEffect } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import firebase from "../../plugins/firebase";
import { secondsToHms } from "../../plugins/formatter";
import { Box, Container, Card } from "@material-ui/core";

export interface Progress {
  id: string;
  total: number;
  value: number;
  percentage: number;
  description: string;
  status: string;
  elapsed: number;
  remaining: number;
  itBySec: number;
  createdAt: Date;
  updatedAt: Date;
}

const useStyles = makeStyles((theme) => ({
  container: {},
  card: {
    minHeight: "140px",
    position: "relative",
    borderRadius: "10px",
    maxWidth: "900px",
    margin: "15px auto",
  },
  progressInner: {
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "#F5F8FF",
    borderRadius: "1px",
    transitionDuration: "1s",
    transitionTimingFunction: "ease",
  },
  progressInnerSolidBar: {
    position: "absolute",
    height: "2px",
    width: "100%",
    bottom: "25%",
    backgroundColor: "#4D28D8",
  },
  progressContent: {
    position: "absolute",
    display: "flex",
    height: "62%",
    bottom: "28%",
    width: "100%",
  },
  progressTextArea: {
    paddingLeft: "2rem",
    paddingTop: "0.5rem",
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  progressInfoText: {
    fontSize: "1rem",
    color: "#939BB0",
    position: "absolute",
    top: "50%",
    transform: "translate(0, -50%)",
  },
}));

const ProgressBox: React.FC<{ progress: Progress }> = ({ progress }) => {
  const classes = useStyles();
  const p = progress;
  return (
    <Card className={classes.card}>
      <Box className={classes.progressInner} width={`${progress.percentage}%`}>
        <Box className={classes.progressInnerSolidBar} />
      </Box>
      <Box className={classes.progressContent}>
        <Box className={classes.progressTextArea}>
          <Box>
            <Typography variant="h5">{`${p.description}`}</Typography>
          </Box>
          <Box paddingLeft={1} flex={1} position={"relative"}>
            <Typography className={classes.progressInfoText}>{`${Math.round(
              p.percentage
            )}% | ${p.value}/${p.total} [${secondsToHms(
              p.elapsed
            )} < ${secondsToHms(p.remaining)}, ${
              Math.round(p.itBySec * 100) / 100
            }it/s]`}</Typography>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

const HomePage: React.FC = () => {
  const classes = useStyles();
  const [progressList, setProgressList] = useState<Progress[]>([]);
  const [loadingState, setLoadingState] = useState<{
    [pid: string]: "loading" | "done";
  }>({});

  const getProgressIdFromUrl = (): string[] => {
    console.log(location.search);
    const args = location.search.replace("?", "").split("&");
    const progressIdList = args
      .filter((arg) => arg.startsWith("pid="))
      .map((arg) => arg.replace("pid=", ""));
    console.log(progressIdList);
    return progressIdList;
  };

  const convertDBToProgress = (progressId: string, dbDict: any): Progress => {
    const updatedAt = new Date(dbDict.updated_at);
    const createdAt = new Date(dbDict.created_at);
    console.log(updatedAt, createdAt);
    const elapsedSec: number =
      (updatedAt.getTime() - createdAt.getTime()) / 1000;
    const itBySec: number = dbDict.value / elapsedSec;
    const remainingSec: number = (dbDict.total - dbDict.value) * itBySec;
    return {
      id: progressId,
      total: dbDict.total,
      value: dbDict.value,
      description: dbDict.description,
      percentage: (dbDict.value / dbDict.total) * 100,
      elapsed: elapsedSec,
      remaining: remainingSec,
      itBySec: itBySec,
      status: dbDict.status,
      updatedAt: createdAt,
      createdAt: updatedAt,
    };
  };

  const listenProgressId = (progressId: string): void => {
    // 登録済みであれば何もしない
    if (loadingState[progressId]) {
      return;
    }
    console.log(loadingState);
    setLoadingState({ ...loadingState, [progressId]: "loading" });
    const progressRef = firebase.database().ref(`progress/${progressId}`);
    // 監視対象に入っていなければ, listenに登録
    progressRef.on("value", (snapshot) => {
      setLoadingState({ ...loadingState, [progressId]: "done" });
      console.log("update", progressId, snapshot.val());
      const dbDict = snapshot.val();
      setProgressList([
        ...progressList,
        convertDBToProgress(progressId, dbDict),
      ]);
      console.log(progressList);
    });
  };

  useEffect(() => {
    // urlからidの取得
    const progressIdList = getProgressIdFromUrl();
    // firebaseでの監視
    progressIdList.forEach(listenProgressId);
  }, [progressList]);

  return (
    <Container className={classes.container}>
      <CssBaseline />
      <Box p={4}>
        <Box marginTop={2}>
          {progressList.map((progress, i) => (
            <ProgressBox key={`${progress.id}-${i}`} progress={progress} />
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default HomePage;
