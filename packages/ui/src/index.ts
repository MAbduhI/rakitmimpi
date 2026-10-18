export {
  cubicBezier,
  type EasingFunction,
  easings,
  resolveEasing,
  type SpringOptions,
  spring,
  steps,
} from "./animation/easing";
export {
  useAnimate,
  useInViewAnimate,
  useSpring,
  useTimeline,
} from "./animation/hooks";
export {
  type StaggerFunction,
  type StaggerOptions,
  stagger,
} from "./animation/stagger";
export { type MotionPoint, motionPath, setDashoffset } from "./animation/svg";
export {
  createTimeline,
  Timeline as AnimationTimeline,
  type TimelineParams as AnimationTimelineParams,
} from "./animation/timeline";
// ─── ANIMATION ENGINE & MOTION PRIMITIVES (ANIME.JS PARITY) ──────────────────
export {
  AnimationInstance,
  type AnimationParams,
  type AnimationTarget,
  animate,
} from "./animation/tween";
export {
  getPresetVariant,
  type MotionProperties,
  type MotionVariant,
  motionPresets,
  type PresetName,
  type TransitionConfig,
} from "./animation/variants";
export {
  AnimateNumber,
  type AnimateNumberProps,
} from "./components/Atom/animate-number";
export {
  Avatar,
  AvatarGroup,
  type AvatarGroupProps,
  type AvatarProps,
  type AvatarStatus,
} from "./components/Atom/avatar";
export { Badge, type BadgeProps } from "./components/Atom/badge";
export { Button, type ButtonProps } from "./components/Atom/button";
export {
  Card,
  CardContent,
  CardDescription,
  type CardExtensionProps,
  CardFooter,
  CardHeader,
  type CardProps,
  CardTitle,
} from "./components/Atom/card";
export { Checkbox, type CheckboxProps, type CheckboxSize } from "./components/Atom/checkbox";
export { Divider, type DividerProps } from "./components/Atom/divider";
export { FlyButton, type FlyButtonProps } from "./components/Atom/fly-button";
export {
  FlyContainer,
  type FlyContainerProps,
  type FlyHorizontal,
  type FlyVertical,
} from "./components/Atom/fly-container";
export { Icon, type IconName, type IconProps, iconNames } from "./components/Atom/icon";
export { Input, type InputProps } from "./components/Atom/input";
export { Kbd, type KbdProps } from "./components/Atom/kbd";
export { Label, type LabelProps } from "./components/Atom/label";
export { Loading, type LoadingProps, type LoadingVariant } from "./components/Atom/loading";
export { Magnetic, type MagneticProps } from "./components/Atom/magnetic";
// Atoms & Molecules
export {
  Motion,
  type MotionBaseProps,
  MotionComponent,
  type MotionProps,
} from "./components/Atom/motion";
export {
  getPageRange,
  type PageSlot,
  Pagination,
  type PaginationChange,
  type PaginationMode,
  type PaginationOffsetChange,
  type PaginationOffsetProps,
  type PaginationPageChange,
  type PaginationPageProps,
  type PaginationProps,
  type PaginationToken,
  type PaginationTokenChange,
  type PaginationTokenProps,
} from "./components/Atom/pagination";
export { Radio, RadioGroup, type RadioGroupProps, type RadioProps, type RadioSize } from "./components/Atom/radio";
// ─── NEW TEMPLATE ENRICHMENT COMPONENTS ──────────────────────────────────────
export { Rating, type RatingProps } from "./components/Atom/rating";
export { ScrollArea, type ScrollAreaProps } from "./components/Atom/scroll-area";
export {
  SegmentedControl,
  type SegmentedControlOption,
  type SegmentedControlProps,
} from "./components/Atom/segmented-control";
export { Select, type SelectOption, type SelectProps } from "./components/Atom/select";
export { Skeleton, type SkeletonProps } from "./components/Atom/skeleton";
// Telemetry, NOC & Mobile Field Components
export {
  StatusChip,
  type StatusChipProps,
} from "./components/Atom/status-chip";
export { SvgDraw, type SvgDrawProps } from "./components/Atom/svg-draw";
export { Switch, type SwitchProps, type SwitchSize } from "./components/Atom/switch";
export { Tag, type TagProps, type TagVariant } from "./components/Atom/tag";
export { Textarea, type TextareaProps } from "./components/Atom/textarea";
export { Alert, type AlertProps, type AlertVariant } from "./components/Molecule/alert";
export {
  AnimatePresence,
  type AnimatePresenceProps,
} from "./components/Molecule/animate-presence";
export {
  BarcodeScannerReticle,
  type BarcodeScannerReticleProps,
} from "./components/Molecule/barcode-scanner-reticle";
export { Breadcrumb, type BreadcrumbItem, type BreadcrumbProps } from "./components/Molecule/breadcrumb";
export {
  addMonths,
  addYears,
  Calendar,
  type CalendarMode,
  type CalendarProps,
  type CalendarRange,
  type CalendarRangeProps,
  type CalendarSingleProps,
  type CalendarWeekStart,
  getMonthGrid,
  getWeekdayLabels,
  getWeekNumber,
  isSameDay,
  isSameMonth,
  startOfDay,
} from "./components/Molecule/calendar";
export {
  CameraViewfinderHUD,
  type CameraViewfinderHUDProps,
} from "./components/Molecule/camera-viewfinder-hud";
export {
  Carousel,
  type CarouselChevron,
  type CarouselEffect,
  type CarouselNavPosition,
  type CarouselProps,
} from "./components/Molecule/carousel";
export {
  Collapse,
  type CollapseIconPosition,
  type CollapseItem,
  type CollapseProps,
} from "./components/Molecule/collapse";
export * from "./components/Molecule/combobox";
export {
  CustomSelect,
  type CustomSelectOption,
  type CustomSelectProps,
} from "./components/Molecule/custom-select/custom-select";
export {
  DiagnosticDumpCard,
  type DiagnosticDumpCardProps,
  type DiagnosticTelemetryData,
} from "./components/Molecule/diagnostic-dump-card";
export { Dropzone, type DropzoneProps } from "./components/Molecule/dropzone";
export {
  type DepartmentShare,
  EmployeeDistributionCard,
  type EmployeeDistributionCardProps,
  type StatusSegment,
} from "./components/Molecule/employee-distribution-card";
export { EmptyState, type EmptyStateProps } from "./components/Molecule/empty-state";
export {
  type FilterChipItem,
  FilterChips,
  type FilterChipsProps,
} from "./components/Molecule/filter-chips";
export {
  LeaveBalanceCard,
  type LeaveBalanceCardProps,
  type LeaveItemBalance,
} from "./components/Molecule/leave-balance-card";
// ─── ENTERPRISE HR & DASHBOARD SUITE (SMARTHR / HRNEXUS) ───────────────────
export {
  MetricStatCard,
  type MetricStatCardProps,
  type MetricStatVariant,
} from "./components/Molecule/metric-stat-card";
export {
  type ApprovalType,
  type PendingApprovalItem,
  PendingApprovalsCard,
  type PendingApprovalsCardProps,
} from "./components/Molecule/pending-approvals-card";
export {
  PollerJitterPill,
  type PollerJitterPillProps,
  type PollerStatus,
} from "./components/Molecule/poller-jitter-pill";
export {
  Progress,
  type ProgressAnimate,
  type ProgressProps,
  type ProgressSize,
  type ProgressStatus,
  type ProgressStepStatus,
  type ProgressVariant,
} from "./components/Molecule/progress";
export { PunctualityDonut, type PunctualityDonutProps } from "./components/Molecule/punctuality-donut";
export {
  ResizeContainer,
  type ResizeContainerProps,
  type ResizeOrientation,
} from "./components/Molecule/resize-container";
export { Result, type ResultProps, type ResultStatus } from "./components/Molecule/result";
export {
  RunBanner,
  type RunBannerNav,
  type RunBannerOrientation,
  type RunBannerProps,
  type RunBannerSize,
} from "./components/Molecule/run-banner";
export {
  type ActiveDeviceInfo,
  SessionTakeoverModal,
  type SessionTakeoverModalProps,
} from "./components/Molecule/session-takeover-modal";
export {
  StaggerList,
  type StaggerListProps,
} from "./components/Molecule/stagger-list";
export { StatRow, type StatRowItem, type StatRowProps } from "./components/Molecule/stat-row";
export {
  StatWidget,
  type StatWidgetProps,
} from "./components/Molecule/stat-widget";
export {
  SwissMenu,
  type SwissMenuItem,
  type SwissMenuProps,
  SwissSelect,
  type SwissSelectOption,
  type SwissSelectProps,
  useDropdown,
} from "./components/Molecule/swiss-dropdown";
export {
  Tab,
  type TabProps,
  Tabs,
  type TabsOrientation,
  type TabsProps,
  type TabsSide,
  type TabsSize,
  type TabsTriggerState,
  type TabsVariant,
  type TabsWidth,
} from "./components/Molecule/tabs";
export {
  TelemetryAreaChart,
  type TelemetryAreaChartProps,
  type TelemetryDataPoint,
  type TimeRangeOption,
} from "./components/Molecule/telemetry-area-chart";
export {
  Timeline,
  type TimelineItem,
  type TimelineMode,
  type TimelineProps,
  type TimelineStatus,
} from "./components/Molecule/timeline";
export {
  type EventCategory,
  type ScheduleEventItem,
  UpcomingEventsCard,
  type UpcomingEventsCardProps,
} from "./components/Molecule/upcoming-events-card";
export { WorkTimerCard, type WorkTimerCardProps } from "./components/Molecule/work-timer-card";
export {
  Dialog,
  DialogBody,
  DialogContent,
  type DialogContentProps,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  type DialogHeaderProps,
  type DialogProps,
  type DialogSectionProps,
  DialogTitle,
} from "./components/Organism/dialog";
export {
  Drawer,
  type DrawerAnimation,
  DrawerBody,
  DrawerContent,
  type DrawerContentProps,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  type DrawerHeaderProps,
  type DrawerProps,
  type DrawerSectionProps,
  type DrawerSide,
  type DrawerSize,
  DrawerTitle,
} from "./components/Organism/drawer";
export { DropdownMenu, type DropdownMenuItem, type DropdownMenuProps } from "./components/Organism/dropdown-menu";
export { Menu, type MenuAnimateType, type MenuItem, type MenuMode, type MenuProps } from "./components/Organism/menu";
export { type NineBoxEmployee, NineBoxMatrix, type NineBoxMatrixProps } from "./components/Organism/NineBoxMatrix";
export {
  NavMenu,
  NavMenuContainer,
  type NavMenuContainerProps,
  type NavMenuHoverAnimation,
  type NavMenuOrientation,
  type NavMenuProps,
  type NavMenuType,
} from "./components/Organism/nav-menu";
export { type NoteItem, NotesWorkspace, type NotesWorkspaceProps } from "./components/Organism/notes-workspace";
export { OrgChartTree, type OrgChartTreeProps, type OrgNode } from "./components/Organism/OrgChartTree";
export { Popover, type PopoverPlacement, type PopoverProps } from "./components/Organism/popover";
export {
  Sidebar,
  type SidebarItem,
  type SidebarMode,
  type SidebarProps,
  type SidebarSide,
} from "./components/Organism/sidebar";
export {
  type StepItem,
  Stepper,
  type StepperProps,
} from "./components/Organism/stepper";
export {
  type Toast,
  type ToasterContextValue,
  ToasterProvider,
  type ToasterProviderProps,
  type ToastOptions,
  type ToastPosition,
  type ToastVariant,
  useToaster,
} from "./components/Organism/toaster";
// Maps is NOT exported here — it lives at `@rakitmimpi/ui/maps` so Leaflet stays
// out of this bundle. See src/maps.ts.
export {
  applyPalette,
  applyTheme,
  getAppliedTheme,
  getPalette,
  getStoredTheme,
  getSystemTheme,
  initTheme,
  type ResolvedTheme,
  resolveTheme,
  setPalette,
  setStoredTheme,
  setTheme,
  subscribeToSystemTheme,
  THEME_ATTRIBUTE,
  THEME_STORAGE_KEY,
  THEME_TOKENS,
  type ThemePalette,
  type ThemePaletteOverrides,
  type ThemePreference,
  type ThemeState,
  type ThemeToken,
  themeScript,
  type UseThemeResult,
  useTheme,
} from "./theme";
export { cn } from "./utils/cn";
export { type DebouncedFunction, debounce } from "./utils/debouncer";
