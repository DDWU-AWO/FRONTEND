import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getTaskDetail, getTasks, TASK_STATUS } from '../api/tasks';
import { Button, StatusPill, Tabs } from '../components';
import { ReactComponent as ClipboardIcon } from '../assets/icon-clipboard-list.svg';

const FILTERS = [
  { value: 'all', label: '전체' },
  { value: TASK_STATUS.running, label: '진행 중' },
  { value: TASK_STATUS.done, label: '완료' },
  { value: TASK_STATUS.paused, label: '멈춤' },
];

// 진행 막대 색상
const barColors = {
  running: 'primary',
  done: 'success',
  paused: 'danger',
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

const Heading = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.text};
`;

const Muted = styled.p`
  font-size: ${({ $size = 14 }) => $size}px;
  line-height: ${({ $lineHeight = 1.2 }) => $lineHeight};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const FilterRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Card = styled.li`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 28px;
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ $gap = 16 }) => $gap}px;
  ${({ $between }) => $between && 'justify-content: space-between;'}
`;

const Request = styled.p`
  flex: 1;
  min-width: 0;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text};
`;

const StepLabel = styled.p`
  flex-shrink: 0;
  width: 176px;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.2;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Bar = styled.div`
  flex: 1;
  height: 8px;
  overflow: hidden;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.surfaceMuted};
`;

const BarValue = styled.div`
  width: ${({ $ratio }) => $ratio * 100}%;
  height: 100%;
  border-radius: 4px;
  background: ${({ theme, $status }) => theme.colors[barColors[$status]]};
`;

const Divider = styled.span`
  width: 1px;
  height: 14px;
  background: ${({ theme }) => theme.colors.border};
`;

const Saved = styled.span`
  font-size: 14px;
  font-weight: 500;
  line-height: 1.2;
  color: ${({ theme }) => theme.colors.primary};
`;

const Empty = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 28px;
  min-height: 500px;
  padding: 40px 16px;
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  text-align: center;
`;

const EmptyIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.primarySoft};
`;

const EmptyText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 600px;

  h2 {
    margin: 0;
    font-size: 24px;
    font-weight: 700;
    line-height: 1.5;
    color: ${({ theme }) => theme.colors.text};
  }
`;

function stepLabel(task) {
  const total = task.steps.length;
  if (task.status === TASK_STATUS.done) return `${total}단계 중 ${total}단계 완료`;
  if (task.status === TASK_STATUS.paused) return `${total}단계 중 ${task.currentStep}단계에서 멈춤`;
  return `${total}단계 중 ${task.currentStep}단계 진행 중`;
}

/**
 * Figma: 05 내 작업 (05-1 목록, 05-2 빈 화면)
 * 개발용: 주소 뒤에 ?demo=empty 를 붙이면 빈 화면을 볼 수 있어요.
 */
function TasksPage() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const isEmptyDemo = new URLSearchParams(search).get('demo') === 'empty';

  const [tasks, setTasks] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    let ignore = false;
    getTasks({ empty: isEmptyDemo }).then((list) => {
      if (!ignore) setTasks(list);
    });
    return () => {
      ignore = true;
    };
  }, [isEmptyDemo]);

  const visible = (tasks ?? []).filter((t) => filter === 'all' || t.status === filter);
  const filterLabel = FILTERS.find((f) => f.value === filter).label;

  const openTask = (task) => {
    const { plan, results, resume } = getTaskDetail(task);
    if (task.status === TASK_STATUS.done) {
      navigate('/new/result', { state: { plan, results } });
    } else {
      navigate('/new/progress', { state: { plan, results, resume } });
    }
  };

  return (
    <Wrapper>
      <Heading>
        <Title>내 작업</Title>
        <Muted $size={16} $lineHeight={1.6}>
          맡긴 일의 진행 상황을 확인하고, 이어서 하거나 결과를 볼 수 있어요.
        </Muted>
      </Heading>

      <FilterRow>
        <Tabs items={FILTERS} value={filter} onChange={setFilter} label="작업 상태" />
        {tasks && (
          <Muted>
            {filterLabel} {visible.length}개
          </Muted>
        )}
      </FilterRow>

      {tasks && visible.length === 0 && (
        <Empty>
          <EmptyIcon>
            <ClipboardIcon width={32} height={32} aria-hidden />
          </EmptyIcon>
          <EmptyText>
            <h2>{tasks.length === 0 ? '아직 맡긴 작업이 없어요' : `${filterLabel} 작업이 없어요`}</h2>
            <Muted $size={16} $lineHeight={1.7}>
              하고 싶은 일을 편하게 적어 보세요.
              <br />
              담당 AI가 차례대로 도와드리고, 진행 상황은 여기에 모아드려요.
            </Muted>
          </EmptyText>
          <Button onClick={() => navigate('/')}>새 작업 시작하기</Button>
        </Empty>
      )}

      {visible.length > 0 && (
        <List>
          {visible.map((task) => {
            const ratio =
              task.status === TASK_STATUS.done ? 1 : task.currentStep / task.steps.length;
            return (
              <Card key={task.id}>
                <Row>
                  <Request>{task.request}</Request>
                  <StatusPill status={task.status} />
                </Row>
                <Row $gap={20}>
                  <StepLabel>{stepLabel(task)}</StepLabel>
                  <Bar
                    role="progressbar"
                    aria-label="진행률"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(ratio * 100)}
                  >
                    <BarValue $ratio={ratio} $status={task.status} />
                  </Bar>
                </Row>
                <Row $between>
                  <Row $gap={20}>
                    <Muted>{task.createdAt}</Muted>
                    <Divider aria-hidden />
                    <Saved>아낀 분량 {task.savedPercent}%</Saved>
                  </Row>
                  <Button
                    variant={task.status === TASK_STATUS.running ? 'primary' : 'secondary'}
                    onClick={() => openTask(task)}
                  >
                    {task.status === TASK_STATUS.done ? '결과 보기' : '이어서 하기'}
                  </Button>
                </Row>
              </Card>
            );
          })}
        </List>
      )}
    </Wrapper>
  );
}

export default TasksPage;
