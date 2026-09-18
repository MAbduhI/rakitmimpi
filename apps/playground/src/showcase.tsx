import {
  AnimateNumber,
  AnimatePresence,
  Badge,
  type BadgeProps,
  Button,
  type ButtonProps,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Carousel,
  ComboBox,
  type ComboBoxOption,
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Divider,
  type DividerProps,
  FlyButton,
  FlyContainer,
  Icon,
  type IconProps,
  Input,
  iconNames,
  Loading,
  type LoadingProps,
  Magnetic,
  Motion,
  Pagination,
  type PresetName,
  Progress,
  RunBanner,
  Skeleton,
  StaggerList,
  SvgDraw,
  Tab,
  Tabs,
  type TabsProps,
  ToasterProvider,
  useToaster,
} from "@rakitmimpi/ui";
import { type CustomTileLayer, Maps, type MarkerInput, type PolylineInput } from "@rakitmimpi/ui/maps";
import { useState } from "react";
import { Section } from "./section";

const comboboxFrameworkOptions: Array<ComboBoxOption> = [
  { value: "next", label: "Next.js" },
  { value: "react", label: "React" },
  { value: "vue", label: "Vue.js" },
  { value: "svelte", label: "Svelte" },
  { value: "angular", label: "Angular", disabled: true },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
];

const buttonVariants: Array<NonNullable<ButtonProps["variant"]>> = [
  "primary",
  "secondary",
  "outline",
  "ghost",
  "destructive",
];

const buttonSizes: Array<NonNullable<ButtonProps["size"]>> = ["sm", "md", "lg"];

const badgeVariants: Array<NonNullable<BadgeProps["variant"]>> = [
  "primary",
  "secondary",
  "outline",
  "accent",
  "success",
  "warning",
  "error",
];

/** The outlined counterparts — these pin `bg-white`, so watch them in dark. */
const badgeHighlightVariants: Array<NonNullable<BadgeProps["variant"]>> = [
  "primary-highlight",
  "accent-highlight",
  "success-highlight",
  "warning-highlight",
  "error-highlight",
];

const loadingVariants: Array<NonNullable<LoadingProps["variant"]>> = ["spinner", "dots", "bars"];

const loadingSizes: Array<NonNullable<LoadingProps["size"]>> = ["sm", "md", "lg"];

const dividerSizes: Array<NonNullable<DividerProps["size"]>> = ["sm", "md", "lg", "xl", "2xl"];

const tabSizes: Array<NonNullable<TabsProps["size"]>> = ["sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl"];

const iconSizes: Array<NonNullable<IconProps["size"]>> = ["sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl"];

/* Jakarta — a depot and two drops, mirroring the Storybook story. */
const mapMarkers: Array<MarkerInput> = [
  { id: "depot", coordinates: [-6.2088, 106.8456], legend: { label: "Depot", show: true } },
  { id: "drop-a", coordinates: [-6.1751, 106.8272], legend: { label: "INV-1041", show: true } },
  { id: "drop-b", coordinates: [-6.2297, 106.8295], legend: { label: "INV-1042", show: true } },
];

const mapRoutes: Array<PolylineInput> = [
  { id: "run-1", coordinates: [[-6.2088, 106.8456] as [number, number], [-6.1751, 106.8272] as [number, number]] },
  { id: "run-2", coordinates: [[-6.2088, 106.8456] as [number, number], [-6.2297, 106.8295] as [number, number]] },
];

const mapCustomLayers: Array<CustomTileLayer> = [
  {
    id: "opentopo",
    name: "OpenTopoMap",
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    options: { attribution: "&copy; OpenStreetMap contributors, SRTM | &copy; OpenTopoMap (CC-BY-SA)" },
  },
  {
    id: "carto-dark",
    name: "Carto Dark",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    options: { attribution: "&copy; OpenStreetMap contributors &copy; CARTO", subdomains: "abcd" },
  },
];

const carouselSlides = (["bg-accent", "bg-accent-secondary", "bg-success", "bg-warning"] as const).map(
  (tone, index) => (
    <div key={tone} className={`flex h-48 items-center justify-center rounded-md ${tone}`}>
      <span className="font-semibold text-accent-foreground text-xl">Slide {index + 1}</span>
    </div>
  ),
);

const runBannerItems = (["map-pin", "truck-delivery", "building-warehouse", "star", "bell", "check"] as const).map(
  (name) => <Icon key={name} name={name} size="2xl" />,
);

/** Every token, so a palette edit can be eyeballed in both themes at once. */
const swatches = [
  "bg-bg",
  "bg-surface",
  "bg-surface-alt",
  "bg-surface-hover",
  "bg-border",
  "bg-input",
  "bg-ring",
  "bg-accent",
  "bg-accent-secondary",
  "bg-primary",
  "bg-secondary",
  "bg-success",
  "bg-warning",
  "bg-error",
  "bg-overlay",
];

const invoices = [
  { id: "INV-1041", client: "Rakit Mimpi", total: "Rp 12.400.000", status: "success" },
  { id: "INV-1042", client: "Nusantara Logistik", total: "Rp 3.850.000", status: "warning" },
  { id: "INV-1043", client: "Teras Digital", total: "Rp 27.100.000", status: "error" },
  { id: "INV-1044", client: "Bumi Karya", total: "Rp 6.200.000", status: "success" },
] as const satisfies ReadonlyArray<{ id: string; client: string; total: string; status: BadgeProps["variant"] }>;

const statusLabels = { success: "Paid", warning: "Pending", error: "Overdue" } as const;

function ToasterDemo() {
  const { showToaster, closeAllToast, toasts } = useToaster();
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        onClick={() => showToaster({ variant: "success", title: "Saved", description: "Invoice updated." })}
        size="sm"
      >
        success
      </Button>
      <Button
        onClick={() => showToaster({ variant: "error", title: "Failed", description: "Could not reach the server." })}
        size="sm"
        variant="outline"
      >
        error
      </Button>
      <Button
        onClick={() =>
          showToaster({
            variant: "custom",
            duration: 0,
            render: ({ close }) => (
              <div className="flex w-72 items-center gap-3 rounded-full border border-border bg-primary py-2 pr-2 pl-4 shadow-lg">
                <Icon className="shrink-0 text-bg" name="trash" size="sm" />
                <p className="flex-1 text-bg text-sm">Invoice deleted</p>
                <button
                  className="shrink-0 rounded-full bg-bg px-3 py-1 font-semibold text-primary text-xs"
                  onClick={close}
                  type="button"
                >
                  Undo
                </button>
              </div>
            ),
          })
        }
        size="sm"
        variant="secondary"
      >
        custom
      </Button>
      <Button disabled={toasts.length === 0} onClick={closeAllToast} size="sm" variant="destructive">
        closeAllToast()
      </Button>
      <code className="text-secondary text-xs">{toasts.length} open</code>
    </div>
  );
}

/**
 * Every exported component with all of its variants and states, so a token or
 * base-class change can be eyeballed everywhere at once.
 *
 * Add a row here whenever you add a component.
 */
export function Showcase() {
  const [offset, setOffset] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [progress, setProgress] = useState(60);
  const [page, setPage] = useState(1);
  const [singleCombo, setSingleCombo] = useState<string>("next");
  const [multiCombo, setMultiCombo] = useState<string | Array<string>>(["next", "react"]);

  return (
    <>
      <Section title="Tokens" description="Toggle the theme in the header — every swatch should move with it.">
        <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
          {swatches.map((swatch) => (
            <div key={swatch} className="flex items-center gap-2">
              <span className={`inline-block size-8 shrink-0 rounded border border-border ${swatch}`} />
              <code className="text-secondary text-xs">{swatch}</code>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Button — variants">
        {buttonVariants.map((variant) => (
          <Button key={variant} variant={variant}>
            {variant}
          </Button>
        ))}
      </Section>

      <Section title="Button — sizes">
        {buttonSizes.map((size) => (
          <Button key={size} size={size}>
            size {size}
          </Button>
        ))}
      </Section>

      <Section title="Button — disabled">
        {buttonVariants.map((variant) => (
          <Button key={variant} disabled variant={variant}>
            {variant}
          </Button>
        ))}
      </Section>

      <Section
        title="Button — loading"
        description="The indicator replaces the label and the button disables itself, so the width shifts."
      >
        {buttonVariants.map((variant) => (
          <Button key={variant} loading variant={variant}>
            {variant}
          </Button>
        ))}
      </Section>

      <Section title="Button — loadingType × size">
        {loadingVariants.map((loadingType) => (
          <div key={loadingType} className="flex items-center gap-3">
            {buttonSizes.map((size) => (
              <Button key={size} loading loadingType={loadingType} size={size}>
                {loadingType} {size}
              </Button>
            ))}
          </div>
        ))}
      </Section>

      <Section title="Badge — variants">
        {badgeVariants.map((variant) => (
          <Badge key={variant} variant={variant}>
            {variant}
          </Badge>
        ))}
      </Section>

      <Section
        title="Badge — highlight variants"
        description="Outlined counterparts of the fills above. They set bg-white directly, so toggle the theme and compare."
      >
        {badgeHighlightVariants.map((variant) => (
          <Badge key={variant} variant={variant}>
            {variant}
          </Badge>
        ))}
      </Section>

      <Section title="Badge — fill vs highlight" description="Same status, both treatments, on the page background.">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary">Primary</Badge>
            <Badge variant="accent">Highlighted</Badge>
            <Badge variant="success">Paid</Badge>
            <Badge variant="warning">Pending</Badge>
            <Badge variant="error">Overdue</Badge>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary-highlight">Primary</Badge>
            <Badge variant="accent-highlight">Highlighted</Badge>
            <Badge variant="success-highlight">Paid</Badge>
            <Badge variant="warning-highlight">Pending</Badge>
            <Badge variant="error-highlight">Overdue</Badge>
          </div>
        </div>
      </Section>

      <Section title="Input — states">
        <div className="flex w-full max-w-sm flex-col gap-3">
          <Input placeholder="Default" />
          <Input defaultValue="With a value" />
          <Input disabled placeholder="Disabled" />
          <Input type="password" defaultValue="hunter2" />
          <Input type="number" defaultValue={42} />
        </div>
      </Section>

      <Section
        title="Input — leftIcon / rightIcon"
        description="Icons sit over the field, so the input keeps its own border and focus ring. Clicking one focuses the input."
      >
        <div className="flex w-full max-w-sm flex-col gap-3">
          <Input leftIcon="search" placeholder="Search orders" type="search" />
          <Input placeholder="Pick a date" rightIcon="calendar" />
          <Input defaultValue="INV-1041" leftIcon="search" rightIcon="x" />
          <Input disabled leftIcon="user" placeholder="Disabled — icon dims too" />
        </div>
      </Section>

      <Section
        title="ComboBox — single & multi-select"
        description="Searchable dropdown with tag chips, filter-as-you-type, and clear actions."
      >
        <div className="grid w-full max-w-2xl grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <span className="font-medium text-secondary text-xs">Single Selection:</span>
            <ComboBox
              options={comboboxFrameworkOptions}
              value={singleCombo}
              onChange={(val) => setSingleCombo(val as string)}
              placeholder="Select a framework..."
            />
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-medium text-secondary text-xs">Multi Selection (Tags):</span>
            <ComboBox
              multiple
              options={comboboxFrameworkOptions}
              value={multiCombo}
              onChange={setMultiCombo}
              placeholder="Select multiple frameworks..."
            />
          </div>
        </div>
      </Section>

      <Section
        title="Table — zebra striping"
        description="No Table component ships yet; this is the token recipe — odd:bg-surface / even:bg-surface-alt."
      >
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-border border-b text-left text-secondary">
              <th className="px-3 py-2 font-medium">Invoice</th>
              <th className="px-3 py-2 font-medium">Client</th>
              <th className="px-3 py-2 font-medium">Total</th>
              <th className="px-3 py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="odd:bg-surface even:bg-surface-alt">
                <td className="px-3 py-2 font-medium">{invoice.id}</td>
                <td className="px-3 py-2">{invoice.client}</td>
                <td className="px-3 py-2 tabular-nums">{invoice.total}</td>
                <td className="px-3 py-2">
                  <Badge variant={invoice.status}>{statusLabels[invoice.status]}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section title="Loading — variants" description="Every variant paints from the root's text color.">
        {loadingVariants.map((variant) => (
          <div key={variant} className="flex flex-col items-center gap-2">
            <Loading variant={variant} />
            <code className="text-secondary text-xs">{variant}</code>
          </div>
        ))}
        <Loading className="text-error" variant="dots" />
        <Loading className="text-success" variant="bars" />
      </Section>

      <Section title="Loading — sizes">
        {loadingSizes.map((size) => (
          <Loading key={size} size={size} />
        ))}
      </Section>

      <Section title="Divider — horizontal thickness">
        <div className="flex w-full flex-col gap-4">
          {dividerSizes.map((size) => (
            <div key={size} className="flex items-center gap-3">
              <code className="w-10 shrink-0 text-secondary text-xs">{size}</code>
              <Divider size={size} />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Divider — vertical thickness">
        <div className="flex h-16 items-center gap-4">
          {dividerSizes.map((size) => (
            <div key={size} className="flex h-full items-center gap-4">
              <code className="text-secondary text-xs">{size}</code>
              <Divider orientation="vertical" size={size} />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Skeleton — shapes">
        <div className="flex w-full max-w-sm gap-3">
          <Skeleton className="w-10 shrink-0" variant="circle" />
          <div className="flex w-full flex-col gap-2">
            <Skeleton variant="text" />
            <Skeleton className="w-2/3" variant="text" />
            <Skeleton className="h-20 w-full" variant="rect" />
          </div>
        </div>
      </Section>

      <Section title="Icon — sizes" description="Icons inherit currentColor, so any text token recolours them.">
        {iconSizes.map((size) => (
          <div key={size} className="flex flex-col items-center gap-2">
            <Icon name="map-pin" size={size} />
            <code className="text-secondary text-xs">{size}</code>
          </div>
        ))}
      </Section>

      <Section title="Icon — registry">
        <div className="grid w-full grid-cols-4 gap-3 sm:grid-cols-8">
          {iconNames.map((name) => (
            <div key={name} className="flex flex-col items-center gap-1">
              <Icon name={name} size="xl" />
              <code className="text-center text-[10px] text-secondary">{name}</code>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="FlyContainer / FlyButton"
        description="Both are position:fixed. The translate-x-0 on this box makes it the containing block, so they stay inside it instead of floating over the page."
      >
        <div className="relative h-80 w-full translate-x-0 rounded-md border border-border bg-surface-alt">
          <FlyButton horizontal="left" icon="menu" vertical="top" />
          <FlyButton horizontal="right" icon="search" variant="secondary" vertical="top" />
          <FlyButton horizontal="left" icon="plus" vertical="bottom">
            New order
          </FlyButton>
          <FlyButton horizontal="right" icon="message-circle" vertical="bottom" />
          <FlyContainer horizontal="center" vertical="mid">
            <div className="rounded-md border border-border bg-surface px-4 py-3 text-primary text-sm shadow-lg">
              FlyContainer — any children
            </div>
          </FlyContainer>
        </div>
      </Section>

      <Section
        title="Maps — markers and routes"
        description="Leaflet loads on the client; the fallback below it is what SSR and slow networks render."
      >
        <Maps
          className="h-96 w-full overflow-hidden rounded-md border border-border"
          center={[-6.2088, 106.8456]}
          markers={mapMarkers}
          routes={mapRoutes}
          zoom={12}
        />
      </Section>

      <Section
        title="Maps — custom tile layers"
        description="customLayers registers extra tile sources in the layer switcher; tileLayer opens on one of their ids."
      >
        <Maps
          className="h-96 w-full overflow-hidden rounded-md border border-border"
          center={[-6.2088, 106.8456]}
          customLayers={mapCustomLayers}
          markers={mapMarkers}
          tileLayer="carto-dark"
          zoom={12}
        />
      </Section>

      <Section
        title="Pagination — numbered (offset / page)"
        description="Both modes know the total, so pages are jumpable. They differ only in the onChange payload."
      >
        <div className="flex w-full flex-col gap-4">
          <Pagination
            limit={20}
            mode="offset"
            offset={offset}
            onChange={(change) => setOffset(change.offset)}
            total={200}
          />
          <Pagination
            mode="page"
            onChange={(change) => setPage(change.page)}
            page={page}
            pageSize={10}
            showJump
            total={5000}
          />
        </div>
      </Section>

      <Section
        title="Pagination — token (cursor / keyset / time)"
        description="An opaque token can only step, and the total is usually unknown, so these render Previous / Next."
      >
        <div className="flex w-full flex-col gap-4">
          <Pagination hasNext hasPrevious label="cursor" mode="cursor" nextToken="eyJpZCI6NDB9" onChange={() => {}} />
          <Pagination hasNext label="keyset — after id 40" mode="keyset" nextToken={60} onChange={() => {}} />
          <Pagination
            hasNext
            label="time — 2026-08-11"
            mode="time"
            nextToken="2026-08-11T00:00:00Z"
            onChange={() => {}}
          />
        </div>
      </Section>

      <Section
        title="Carousel — scroll, fade, vertical"
        description="Hover or focus an autoplaying carousel to pause it. Arrow keys step it when focus is inside."
      >
        <div className="grid w-full gap-8 lg:grid-cols-2">
          <div className="flex flex-col gap-2">
            <code className="text-secondary text-xs">scroll + chevron + infinity</code>
            <Carousel chevron="horizontal" infinity>
              {carouselSlides}
            </Carousel>
          </div>
          <div className="flex flex-col gap-2">
            <code className="text-secondary text-xs">fade + autoScroll</code>
            <Carousel autoScroll fade infinity speed={2500}>
              {carouselSlides}
            </Carousel>
          </div>
          <div className="flex flex-col gap-2">
            <code className="text-secondary text-xs">vertical + navPosition="right"</code>
            <Carousel chevron="vertical" navPosition="right" vertical>
              {carouselSlides}
            </Carousel>
          </div>
          <div className="flex flex-col gap-2">
            <code className="text-secondary text-xs">navPosition="top", no chevron</code>
            <Carousel navPosition="top">{carouselSlides}</Carousel>
          </div>
        </div>
      </Section>

      <Section
        title="RunBanner — marquee"
        description="Infinite by design: the content is rendered twice and the track slides by exactly one copy."
      >
        <div className="flex w-full flex-col gap-6">
          <div className="flex flex-col gap-1">
            <code className="text-secondary text-xs">nav="left" (default)</code>
            <RunBanner className="rounded-md border border-border bg-surface-alt" size="2xl">
              {runBannerItems}
            </RunBanner>
          </div>
          <div className="flex flex-col gap-1">
            <code className="text-secondary text-xs">nav="right", endGap, faster</code>
            <RunBanner
              className="rounded-md border border-border bg-surface-alt"
              endGap
              gap={64}
              nav="right"
              size="2xl"
              speed={8000}
            >
              {runBannerItems}
            </RunBanner>
          </div>
          <div className="flex gap-6">
            <div className="flex flex-col gap-1">
              <code className="text-secondary text-xs">nav="top"</code>
              <RunBanner className="h-56 rounded-md border border-border bg-surface-alt" nav="top" size="2xl">
                {runBannerItems}
              </RunBanner>
            </div>
            <div className="flex flex-col gap-1">
              <code className="text-secondary text-xs">nav="bottom"</code>
              <RunBanner className="h-56 rounded-md border border-border bg-surface-alt" nav="bottom" size="2xl">
                {runBannerItems}
              </RunBanner>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Tabs — variants, widths, custom trigger">
        <div className="flex w-full flex-col gap-8">
          <div className="flex flex-col gap-1">
            <code className="text-secondary text-xs">variant="default", icon + note</code>
            <Tabs>
              <Tab icon="home" label="Overview" value="a">
                <p className="text-secondary text-sm">Totals and recent activity.</p>
              </Tab>
              <Tab icon="download" label="Invoices" note={<Badge variant="error">12</Badge>} value="b">
                <p className="text-secondary text-sm">Every invoice, filterable.</p>
              </Tab>
              <Tab icon="settings" label="Settings" value="c">
                <p className="text-secondary text-sm">Workspace preferences.</p>
              </Tab>
            </Tabs>
          </div>

          <div className="flex flex-col gap-1">
            <code className="text-secondary text-xs">size sm → 5xl</code>
            <div className="flex flex-col gap-4">
              {tabSizes.map((size) => (
                <Tabs key={size} size={size}>
                  <Tab icon="home" label={`Overview ${size}`} value="a">
                    <p className="text-secondary text-sm">Type, padding, gap and icon all scale together.</p>
                  </Tab>
                  <Tab icon="settings" label="Settings" value="b">
                    <p className="text-secondary text-sm">Second panel.</p>
                  </Tab>
                </Tabs>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <code className="text-secondary text-xs">variant="panel", width="fill"</code>
            <Tabs variant="panel" width="fill">
              <Tab label="Day" value="d">
                <p className="text-secondary text-sm">Today.</p>
              </Tab>
              <Tab label="Week" value="w">
                <p className="text-secondary text-sm">This week.</p>
              </Tab>
              <Tab label="Month" value="m">
                <p className="text-secondary text-sm">This month.</p>
              </Tab>
            </Tabs>
          </div>

          <div className="flex flex-col gap-1">
            <code className="text-secondary text-xs">maxView=&#123;3&#125; — the rest collapse</code>
            <Tabs maxView={3}>
              {["Overview", "Invoices", "Clients", "Reports", "Settings", "Billing"].map((label) => (
                <Tab key={label} label={label} value={label.toLowerCase()}>
                  <p className="text-secondary text-sm">The {label} panel.</p>
                </Tab>
              ))}
            </Tabs>
          </div>

          <div className="flex flex-col gap-1">
            <code className="text-secondary text-xs">orientation="vertical" + renderTrigger</code>
            <Tabs
              orientation="vertical"
              renderTrigger={(tab, state) => (
                <button
                  className={`flex w-40 items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors ${
                    state.active ? "bg-accent text-accent-foreground" : "text-secondary hover:bg-surface-alt"
                  }`}
                  onClick={state.select}
                  type="button"
                >
                  {tab.label}
                </button>
              )}
            >
              <Tab label="Profile" value="p">
                <p className="text-secondary text-sm">Custom triggers, same state.</p>
              </Tab>
              <Tab label="Security" value="s">
                <p className="text-secondary text-sm">Second panel.</p>
              </Tab>
            </Tabs>
          </div>
        </div>
      </Section>

      <Section title="Progress — variants" description="value is always 0–100; steps splits it for dot and stepper.">
        <div className="flex w-full flex-col gap-6">
          <div className="flex items-center gap-4">
            <Button onClick={() => setProgress((v) => Math.max(0, v - 20))} size="sm" variant="outline">
              −20
            </Button>
            <Button onClick={() => setProgress((v) => Math.min(100, v + 20))} size="sm">
              +20
            </Button>
            <code className="text-secondary text-xs">value = {progress}</code>
          </div>
          <div className="max-w-md">
            <Progress value={progress} />
          </div>
          <Progress steps={5} value={progress} variant="dot" />
          <Progress labels={["Cart", "Address", "Payment", "Done"]} steps={4} value={progress} variant="stepper" />
          <div className="flex items-end gap-6">
            <Progress size="sm" value={progress} variant="round" />
            <Progress size="md" status="success" value={progress} variant="round" />
            <Progress size="lg" status="warning" value={progress} variant="round" />
          </div>
        </div>
      </Section>

      <Section title="Dialog" description="Built on the native <dialog>, so Escape, focus trap and backdrop are free.">
        <Button onClick={() => setDialogOpen(true)}>Open dialog</Button>
        <Dialog onClose={() => setDialogOpen(false)} open={dialogOpen}>
          <DialogContent>
            <DialogHeader devider>
              <DialogTitle>Delete invoice</DialogTitle>
              <DialogDescription>INV-1043 — Teras Digital</DialogDescription>
            </DialogHeader>
            <DialogBody className="py-4">
              <p className="text-secondary text-sm">
                Try Escape, the backdrop, and the ✕ — all three route through onClose.
              </p>
            </DialogBody>
            <DialogFooter devider>
              <Button onClick={() => setDialogOpen(false)} variant="outline">
                Cancel
              </Button>
              <Button onClick={() => setDialogOpen(false)} variant="destructive">
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Section>

      <Section title="Toaster" description="useToaster() gives showToaster, closeToast(id) and closeAllToast.">
        <ToasterProvider position="bottom-right">
          <ToasterDemo />
        </ToasterProvider>
      </Section>

      <Section title="Card — devider" description="Rules off the header and footer. Check both themes.">
        <div className="flex flex-wrap gap-6">
          <Card className="w-72">
            <CardHeader>
              <CardTitle>Without devider</CardTitle>
              <CardDescription>Spacing alone separates the sections.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-secondary text-sm">Body copy.</p>
            </CardContent>
            <CardFooter>
              <Button size="sm">Action</Button>
            </CardFooter>
          </Card>

          <Card className="w-72">
            <CardHeader devider>
              <CardTitle>With devider</CardTitle>
              <CardDescription>A rule marks each boundary.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-secondary text-sm">Body copy.</p>
            </CardContent>
            <CardFooter className="pt-6" devider>
              <Button size="sm">Action</Button>
            </CardFooter>
          </Card>
        </div>
      </Section>

      <Section title="Card — full composition">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Rakit Mimpi</CardTitle>
            <CardDescription>Build your dream UI, one component at a time.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-secondary text-sm">
              Card body copy. Swap tokens in <code>styles.css</code> and everything here follows.
            </p>
          </CardContent>
          <CardFooter className="gap-2">
            <Button size="sm">Save</Button>
            <Button size="sm" variant="outline">
              Cancel
            </Button>
          </CardFooter>
        </Card>
      </Section>

      {/* ─── ANIMATION & MOTION PRIMITIVES SHOWCASE ─── */}
      <Section
        title="Animation Engine & Motion Primitives (Anime.js Parity)"
        description="Zero-dependency 60/120fps physics, hardware 3D transforms, SVG tracing, staggers, and rich variants."
      >
        <AnimationDemo />
      </Section>
    </>
  );
}

function AnimationDemo() {
  const [selectedPreset, setSelectedPreset] = useState<PresetName>("fade-up");
  const [animKey, setAnimKey] = useState(0);
  const [counterVal, setCounterVal] = useState(1250000);
  const [showPresence, setShowPresence] = useState(true);

  const presets: Array<PresetName> = ["fade-up", "pop", "elastic-up", "flip-x", "blur-in", "float", "pulse", "shake"];

  return (
    <div className="flex flex-col gap-8">
      {/* 1. Preset Variants Explorer */}
      <div className="flex flex-col gap-4">
        <h4 className="font-bold text-primary text-sm">1. Rich Motion Presets</h4>
        <div className="flex flex-wrap gap-2">
          {presets.map((p) => (
            <Button
              key={p}
              size="sm"
              variant={selectedPreset === p ? "primary" : "outline"}
              onClick={() => {
                setSelectedPreset(p);
                setAnimKey((k) => k + 1);
              }}
            >
              {p}
            </Button>
          ))}
          <Button size="sm" variant="ghost" onClick={() => setAnimKey((k) => k + 1)}>
            ↻ Re-trigger
          </Button>
        </div>

        <div className="flex h-36 items-center justify-center rounded-xl border border-border bg-surface-alt p-6">
          <Motion.div
            key={`${selectedPreset}-${animKey}`}
            preset={selectedPreset}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer rounded-xl bg-accent px-8 py-4 font-bold text-accent-foreground shadow-md"
          >
            Active Preset: {selectedPreset}
          </Motion.div>
        </div>
      </div>

      {/* 2. Magnetic Button & Interactive Springs */}
      <div className="flex flex-col gap-4">
        <h4 className="font-bold text-primary text-sm">2. Magnetic Cursor Tracking & Spring Physics</h4>
        <div className="flex items-center gap-6 rounded-xl border border-border bg-surface p-6">
          <Magnetic strength={0.4}>
            <Button variant="primary" size="lg" className="shadow-lg">
              🧲 Magnetic Pull Me
            </Button>
          </Magnetic>
          <Magnetic strength={0.6}>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent font-bold text-accent-foreground shadow-md">
              🎯
            </div>
          </Magnetic>
          <p className="text-secondary text-xs">
            Smoothly pulls toward mouse coordinates and snaps back using elastic harmonic oscillation.
          </p>
        </div>
      </div>

      {/* 3. Tabular Animated Counter & SVG Drawing */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-6">
          <h4 className="font-bold text-primary text-sm">3. Tabular AnimateNumber Counter</h4>
          <div className="flex items-baseline gap-2">
            <span className="text-secondary text-sm">Revenue:</span>
            <AnimateNumber
              value={counterVal}
              from={0}
              duration={1500}
              format={(v) => `Rp ${Math.round(v).toLocaleString("id-ID")}`}
              className="font-black text-2xl text-primary"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button size="sm" onClick={() => setCounterVal((v) => v + 500000)}>
              + Rp 500.000
            </Button>
            <Button size="sm" variant="outline" onClick={() => setCounterVal((v) => Math.max(0, v - 300000))}>
              - Rp 300.000
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-6">
          <h4 className="font-bold text-primary text-sm">4. SVG Path Tracing (setDashoffset)</h4>
          <div className="flex items-center justify-around py-2">
            <SvgDraw
              path="M 20 50 L 40 70 L 80 30"
              stroke="#10B981"
              strokeWidth={4}
              duration={1500}
              className="h-16 w-16"
            />
            <SvgDraw
              path="M 50,30 A 20,20 0,0,0 10,50 C 10,70 50,90 50,90 C 50,90 90,70 90,50 A 20,20 0,0,0 50,30 Z"
              stroke="#EF4444"
              strokeWidth={3}
              duration={1800}
              className="h-16 w-16"
            />
          </div>
        </div>
      </div>

      {/* 4. Staggered List & AnimatePresence */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-6">
          <h4 className="font-bold text-primary text-sm">5. StaggerList (Cascade Entry)</h4>
          <StaggerList staggerDelay={60}>
            {["⚡ High Throughput Pipeline", "🛡️ Zero Hardcoded Secrets", "📦 Micro-frontend Ready"].map((txt) => (
              <Motion.div
                key={txt}
                preset="fade-up"
                className="rounded-lg border border-border bg-surface-alt p-2.5 font-medium text-primary text-xs shadow-2xs"
              >
                {txt}
              </Motion.div>
            ))}
          </StaggerList>
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-6">
          <h4 className="font-bold text-primary text-sm">6. AnimatePresence (Exit Transitions)</h4>
          <Button size="sm" variant="outline" onClick={() => setShowPresence(!showPresence)}>
            {showPresence ? "Unmount Box" : "Mount Box"}
          </Button>
          <div className="flex h-20 items-center justify-center">
            <AnimatePresence>
              {showPresence && (
                <Motion.div
                  key="presence-demo"
                  preset="pop"
                  exit={{ opacity: 0, scale: 0.75 }}
                  className="rounded-lg bg-accent px-4 py-2 font-bold text-accent-foreground text-xs shadow-sm"
                >
                  Unmounting with smooth exit transition
                </Motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
