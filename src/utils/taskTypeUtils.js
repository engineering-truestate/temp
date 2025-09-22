import { TASK_TYPE_OPTIONS } from '../constants/taskTypeOptions'

export const getTaskTypeLabel = (value) => {
  const option = TASK_TYPE_OPTIONS.find(opt => opt.value === value)
  return option ? option.label : value
}