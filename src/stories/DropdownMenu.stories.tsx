import type { Meta, StoryObj } from '@storybook/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuShortcut,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Settings,
  LogOut,
  Edit,
  Trash2,
  Copy,
  Share,
  Download,
  Print,
  Eye,
  EyeOff,
  Star,
  StarOff,
  Calendar,
  Clock,
  Phone,
  Mail,
  MapPin,
  FileText,
  Image,
  Archive,
  MoreHorizontal,
  MoreVertical,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Heart,
  Activity,
  Stethoscope,
  Pill,
  TestTube,
  FileImage,
  UserPlus,
  UserMinus,
  Send,
  Bookmark,
  BookmarkCheck,
  Flag,
  MessageSquare,
  Clipboard,
  RefreshCw,
  Plus,
  Minus,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Grid,
  List,
  ChevronDown,
  ChevronRight,
  Info,
  HelpCircle,
  ExternalLink,
  Upload,
  Folder,
  FolderOpen,
  Save,
  X,
  Check,
  Bell,
  BellOff,
  Lock,
  Unlock,
  Key,
  Database,
  Server,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Wifi,
  WifiOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Stop,
  SkipForward,
  SkipBack,
  Repeat,
  Shuffle,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Move,
  Crop,
  Scissors,
  PaintBucket,
  Palette,
  Brush,
  Eraser,
  Type,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Indent,
  Outdent,
  ListOrdered,
  ListUnordered,
  Quote,
  Code,
  Link,
  Unlink,
  Image as ImageIcon,
  Video,
  Music,
  Headphones,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Flashlight,
  FlashlightOff,
  Sun,
  Moon,
  CloudRain,
  CloudSnow,
  Zap,
  Flame,
  Droplets,
  Wind,
  Thermometer,
  Gauge,
  Battery,
  BatteryLow,
  Plug,
  Power,
  PowerOff,
  Cpu,
  HardDrive,
  MemoryStick,
  Router,
  Globe,
  Navigation,
  Compass,
  Map,
  MapPin as MapPinIcon,
  Home,
  Building,
  Store,
  Car,
  Truck,
  Plane,
  Train,
  Ship,
  Bike,
  Footprints,
  TreePine,
  Flower,
  Leaf,
  Apple,
  Cherry,
  Grape,
  Carrot,
  Fish,
  Beef,
  Egg,
  Milk,
  Coffee,
  Wine,
  Beer,
  IceCream,
  Pizza,
  Sandwich,
  Cookie,
  Cake,
  Gift,
  PartyPopper,
  Balloon,
  Crown,
  Award,
  Trophy,
  Medal,
  Target,
  Crosshair,
  Focus,
  Scan,
  QrCode,
  Barcode,
  Hash,
  AtSign,
  Percent,
  DollarSign,
  Euro,
  PoundSterling,
  Yen,
  CreditCard,
  Wallet,
  Coins,
  Banknote,
  Receipt,
  Calculator,
  Abacus,
  Scale,
  Ruler,
  Scissors as ScissorsIcon,
  Wrench,
  Hammer,
  Screwdriver,
  Drill,
  Saw,
  Pickaxe,
  Shovel,
  Axe,
  Knife,
  Sword,
  Shield as ShieldIcon,
  Helmet,
  Glasses,
  Shirt,
  Hat,
  Footprints as FootprintsIcon,
  Watch,
  Timer,
  Stopwatch,
  Hourglass,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  Sunrise,
  Sunset,
  Moon as MoonIcon,
  Sun as SunIcon,
  Star as StarIcon,
  Sparkles,
  Zap as ZapIcon,
  Bolt,
  Flash,
  Flame as FlameIcon,
  Snowflake,
  Umbrella,
  Cloud,
  CloudRain as CloudRainIcon,
  CloudSnow as CloudSnowIcon,
  CloudLightning,
  CloudDrizzle,
  CloudHail,
  Tornado,
  Rainbow,
  Waves,
  Mountain,
  Volcano,
  Desert,
  Forest,
  Island,
  Beach,
  Tent,
  Campfire,
  Compass as CompassIcon,
  Map as MapIcon,
  Globe as GlobeIcon,
  Earth,
  Satellite,
  Rocket,
  Ufo,
  Alien,
  Robot,
  Ghost,
  Skull,
  Heart as HeartIcon,
  Smile,
  Frown,
  Meh,
  Angry,
  Laugh,
  Cry,
  Kiss,
  ThumbsUp,
  ThumbsDown,
  Clap,
  Wave,
  Peace,
  Victory,
  Muscle,
  Pray,
  Handshake,
  Hug,
  Eyes,
  Ear,
  Nose,
  Mouth,
  Tongue,
  Tooth,
  Bone,
  Brain as BrainIcon,
  Lungs,
  Kidney,
  Liver,
  Stomach,
  Intestine,
  BloodDrop,
  Dna,
  Virus,
  Bacteria,
  Pill as PillIcon,
  Syringe,
  Bandage,
  Crutch,
  Wheelchair,
  Stethoscope as StethoscopeIcon,
  Thermometer as ThermometerIcon,
  Scale as ScaleIcon,
  Microscope,
  TestTube as TestTubeIcon,
  Beaker,
  Petri,
  Dna as DnaIcon,
  Atom,
  Molecule,
  Flask,
  Magnet,
  Telescope,
  Binoculars,
  Magnifier,
  MagnifyingGlass,
  Search as SearchIcon,
  Filter as FilterIcon,
  Sort,
  SortAsc as SortAscIcon,
  SortDesc as SortDescIcon,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
  ArrowLeftRight,
  ArrowUpLeft,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowDownRight,
  ChevronUp,
  ChevronDown as ChevronDownIcon,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  ChevronsUp,
  ChevronsDown,
  ChevronsLeft,
  ChevronsRight,
  CornerDownLeft,
  CornerDownRight,
  CornerUpLeft,
  CornerUpRight,
  CornerLeftDown,
  CornerLeftUp,
  CornerRightDown,
  CornerRightUp,
  Move3d,
  RotateCcw as RotateCcwIcon,
  RotateCw as RotateCwIcon,
  Repeat as RepeatIcon,
  Shuffle as ShuffleIcon,
  Maximize as MaximizeIcon,
  Minimize as MinimizeIcon,
  Expand,
  Shrink,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Focus as FocusIcon,
  Scan as ScanIcon,
  Crop as CropIcon,
  Move as MoveIcon,
  Resize,
  FlipHorizontal,
  FlipVertical,
  RotateClockwise,
  RotateCounterClockwise,
  Straighten,
  Contrast,
  Brightness,
  Saturation,
  Hue,
  Gamma,
  Exposure,
  Highlights,
  Shadows,
  Whites,
  Blacks,
  Clarity,
  Vibrance,
  Temperature,
  Tint,
  Noise,
  Sharpen,
  Blur,
  Vignette,
  Grain,
  ChromaticAberration,
  Distortion,
  Perspective,
  Keystone,
  Lens,
  Aperture,
  Shutter,
  Iso,
  WhiteBalance,
  Exposure as ExposureIcon,
  Flash as FlashIcon,
  Timer as TimerIcon,
  SelfTimer,
  Burst,
  Hdr,
  Panorama,
  Portrait,
  Landscape,
  Macro,
  Telephoto,
  WideAngle,
  FishEye,
  Zoom,
  Autofocus,
  ManualFocus,
  FaceDetection,
  SmileDetection,
  EyeDetection,
  RedEye,
  AntiShake,
  ImageStabilization,
  OpticalZoom,
  DigitalZoom,
  ContinuousShoot,
  SingleShoot,
  VideoRecord,
  VideoStop,
  VideoPause,
  VideoPlay,
  VideoRewind,
  VideoFastForward,
  VideoSlowMotion,
  VideoTimeLapse,
  VideoLoop,
  VideoMute,
  VideoUnmute,
  VideoFullscreen,
  VideoExitFullscreen,
  VideoPictureInPicture,
  VideoSubtitles,
  VideoClosedCaptions,
  VideoQuality,
  VideoSpeed,
  VideoVolume,
  VideoBrightness,
  VideoContrast,
  VideoSaturation,
  VideoHue,
  VideoGamma,
  VideoExposure,
  VideoWhiteBalance,
  VideoColorTemperature,
  VideoTint,
  VideoSharpness,
  VideoNoise,
  VideoStabilization,
  VideoZoom as VideoZoomIcon,
  VideoFocus,
  VideoFlash,
  VideoTimer,
  VideoFormat,
  VideoCodec,
  VideoBitrate,
  VideoFramerate,
  VideoResolution,
  VideoAspectRatio,
  VideoOrientation,
  VideoRotate,
  VideoFlip,
  VideoCrop,
  VideoTrim,
  VideoSplit,
  VideoMerge,
  VideoTransition,
  VideoEffect,
  VideoFilter,
  VideoOverlay,
  VideoText,
  VideoTitle,
  VideoSubtitle,
  VideoWatermark,
  VideoLogo,
  VideoBorder,
  VideoShadow,
  VideoGlow,
  VideoBlur as VideoBlurIcon,
  VideoSharpen as VideoSharpenIcon,
  VideoNoise as VideoNoiseIcon,
  VideoGrain as VideoGrainIcon,
  VideoVignette as VideoVignetteIcon,
  VideoDistortion as VideoDistortionIcon,
  VideoPerspective as VideoPerspectiveIcon,
  VideoKeystone as VideoKeystoneIcon,
  VideoLens as VideoLensIcon,
  VideoAperture as VideoApertureIcon,
  VideoShutter as VideoShutterIcon,
  VideoIso as VideoIsoIcon,
  VideoExposure as VideoExposureIcon,
  VideoWhiteBalance as VideoWhiteBalanceIcon,
  VideoColorTemperature as VideoColorTemperatureIcon,
  VideoTint as VideoTintIcon,
  VideoSharpness as VideoSharpnessIcon,
  VideoNoise as VideoNoiseIcon2,
  VideoStabilization as VideoStabilizationIcon,
  VideoZoom as VideoZoomIcon2,
  VideoFocus as VideoFocusIcon,
  VideoFlash as VideoFlashIcon,
  VideoTimer as VideoTimerIcon,
  VideoFormat as VideoFormatIcon,
  VideoCodec as VideoCodecIcon,
  VideoBitrate as VideoBitrateIcon,
  VideoFramerate as VideoFramerateIcon,
  VideoResolution as VideoResolutionIcon,
  VideoAspectRatio as VideoAspectRatioIcon,
  VideoOrientation as VideoOrientationIcon,
  VideoRotate as VideoRotateIcon,
  VideoFlip as VideoFlipIcon,
  VideoCrop as VideoCropIcon,
  VideoTrim as VideoTrimIcon,
  VideoSplit as VideoSplitIcon,
  VideoMerge as VideoMergeIcon,
  VideoTransition as VideoTransitionIcon,
  VideoEffect as VideoEffectIcon,
  VideoFilter as VideoFilterIcon,
  VideoOverlay as VideoOverlayIcon,
  VideoText as VideoTextIcon,
  VideoTitle as VideoTitleIcon,
  VideoSubtitle as VideoSubtitleIcon,
  VideoWatermark as VideoWatermarkIcon,
  VideoLogo as VideoLogoIcon,
  VideoBorder as VideoBorderIcon,
  VideoShadow as VideoShadowIcon,
  VideoGlow as VideoGlowIcon,
} from 'lucide-react';
import { useState } from 'react';

const meta: Meta<typeof DropdownMenu> = {
  title: 'UI/DropdownMenu',
  component: DropdownMenu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Componente DropdownMenu para criar menus suspensos com opções e ações, útil para interfaces médicas com múltiplas funcionalidades.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Abrir Menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Perfil</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Configurações</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Shield className="mr-2 h-4 w-4" />
          <span>Segurança</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const PatientActions: Story = {
  render: () => (
    <div className="flex items-center space-x-4">
      <Avatar>
        <AvatarImage src="/placeholder-avatar.jpg" />
        <AvatarFallback>JS</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <h3 className="font-semibold">João Silva Santos</h3>
        <p className="text-sm text-muted-foreground">CPF: 123.456.789-00</p>
      </div>
      <Badge className="bg-green-100 text-green-800">Ativo</Badge>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel>Ações do Paciente</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              <span>Ver Detalhes</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              <span>Editar Dados</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Calendar className="mr-2 h-4 w-4" />
              <span>Agendar Consulta</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <FileText className="mr-2 h-4 w-4" />
                <span>Documentos</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" />
                  <span>Baixar Prontuário</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Print className="mr-2 h-4 w-4" />
                  <span>Imprimir Receita</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share className="mr-2 h-4 w-4" />
                  <span>Compartilhar Exames</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <TestTube className="mr-2 h-4 w-4" />
                <span>Exames</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>
                  <Plus className="mr-2 h-4 w-4" />
                  <span>Solicitar Exame</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Eye className="mr-2 h-4 w-4" />
                  <span>Ver Resultados</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  <span>Atualizar Status</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Phone className="mr-2 h-4 w-4" />
            <span>Ligar para Paciente</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Mail className="mr-2 h-4 w-4" />
            <span>Enviar Email</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600 focus:text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Arquivar Paciente</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
};

export const AppointmentMenu: Story = {
  render: () => {
    const [appointmentStatus, setAppointmentStatus] = useState('agendada');

    return (
      <div className="p-4 border rounded-lg space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Consulta Cardiológica</h3>
            <p className="text-sm text-muted-foreground">
              Dr. Carlos Mendes • 25/11/2024 às 14:30
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge
              className={
                appointmentStatus === 'agendada'
                  ? 'bg-blue-100 text-blue-800'
                  : appointmentStatus === 'confirmada'
                    ? 'bg-green-100 text-green-800'
                    : appointmentStatus === 'cancelada'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
              }
            >
              {appointmentStatus === 'agendada'
                ? 'Agendada'
                : appointmentStatus === 'confirmada'
                  ? 'Confirmada'
                  : appointmentStatus === 'cancelada'
                    ? 'Cancelada'
                    : 'Em Andamento'}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>Ações da Consulta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Eye className="mr-2 h-4 w-4" />
                    <span>Ver Detalhes</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Editar Consulta</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Copy className="mr-2 h-4 w-4" />
                    <span>Duplicar Consulta</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Status da Consulta</DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={appointmentStatus}
                  onValueChange={setAppointmentStatus}
                >
                  <DropdownMenuRadioItem value="agendada">
                    <Clock className="mr-2 h-4 w-4" />
                    Agendada
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="confirmada">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Confirmada
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="em-andamento">
                    <Activity className="mr-2 h-4 w-4" />
                    Em Andamento
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="cancelada">
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancelada
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Phone className="mr-2 h-4 w-4" />
                    <span>Ligar para Paciente</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Mail className="mr-2 h-4 w-4" />
                    <span>Enviar Lembrete</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <span>Enviar SMS</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600 focus:text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Cancelar Consulta</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <User className="mr-1 h-3 w-3" />
            João Silva Santos
          </div>
          <div className="flex items-center">
            <MapPin className="mr-1 h-3 w-3" />
            Consultório 205
          </div>
          <div className="flex items-center">
            <Stethoscope className="mr-1 h-3 w-3" />
            Cardiologia
          </div>
        </div>
      </div>
    );
  },
};

export const MedicalRecordActions: Story = {
  render: () => {
    const [viewMode, setViewMode] = useState('detalhado');
    const [notifications, setNotifications] = useState({
      exames: true,
      consultas: true,
      medicamentos: false,
      emergencias: true,
    });

    return (
      <div className="p-4 border rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Prontuário Médico - João Silva Santos
            </h3>
            <p className="text-sm text-muted-foreground">
              Última atualização: 22/11/2024
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Opções
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end">
              <DropdownMenuLabel>Configurações do Prontuário</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                  VISUALIZAÇÃO
                </DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={viewMode}
                  onValueChange={setViewMode}
                >
                  <DropdownMenuRadioItem value="resumido">
                    <List className="mr-2 h-4 w-4" />
                    Resumido
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="detalhado">
                    <Grid className="mr-2 h-4 w-4" />
                    Detalhado
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="cronologico">
                    <Clock className="mr-2 h-4 w-4" />
                    Cronológico
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                  NOTIFICAÇÕES
                </DropdownMenuLabel>
                <DropdownMenuCheckboxItem
                  checked={notifications.exames}
                  onCheckedChange={checked =>
                    setNotifications(prev => ({ ...prev, exames: checked }))
                  }
                >
                  <TestTube className="mr-2 h-4 w-4" />
                  Novos Exames
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={notifications.consultas}
                  onCheckedChange={checked =>
                    setNotifications(prev => ({ ...prev, consultas: checked }))
                  }
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Consultas Agendadas
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={notifications.medicamentos}
                  onCheckedChange={checked =>
                    setNotifications(prev => ({
                      ...prev,
                      medicamentos: checked,
                    }))
                  }
                >
                  <Pill className="mr-2 h-4 w-4" />
                  Medicamentos
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={notifications.emergencias}
                  onCheckedChange={checked =>
                    setNotifications(prev => ({
                      ...prev,
                      emergencias: checked,
                    }))
                  }
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Emergências
                </DropdownMenuCheckboxItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" />
                  <span>Exportar PDF</span>
                  <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Print className="mr-2 h-4 w-4" />
                  <span>Imprimir</span>
                  <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share className="mr-2 h-4 w-4" />
                  <span>Compartilhar</span>
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Archive className="mr-2 h-4 w-4" />
                  <span>Arquivar</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>
                    <Folder className="mr-2 h-4 w-4" />
                    <span>Arquivo Temporário</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FolderOpen className="mr-2 h-4 w-4" />
                    <span>Arquivo Permanente</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600 focus:text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Excluir Definitivamente</span>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 font-medium text-blue-800">
              <Heart className="h-4 w-4" />
              Sinais Vitais
            </div>
            <p className="text-blue-600 mt-1">Última medição: Hoje</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 font-medium text-green-800">
              <TestTube className="h-4 w-4" />
              Exames
            </div>
            <p className="text-green-600 mt-1">3 pendentes</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center gap-2 font-medium text-purple-800">
              <Pill className="h-4 w-4" />
              Medicamentos
            </div>
            <p className="text-purple-600 mt-1">5 ativos</p>
          </div>
        </div>
      </div>
    );
  },
};

export const ExamResultsMenu: Story = {
  render: () => (
    <div className="space-y-4">
      {/* Exame de Sangue */}
      <div className="p-4 border rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <TestTube className="h-4 w-4 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold">Hemograma Completo</h3>
              <p className="text-sm text-muted-foreground">
                20/11/2024 • Laboratório Central
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="mr-1 h-3 w-3" />
              Normal
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48" align="end">
                <DropdownMenuLabel>Ações do Exame</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Eye className="mr-2 h-4 w-4" />
                  <span>Ver Resultados</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" />
                  <span>Baixar PDF</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Print className="mr-2 h-4 w-4" />
                  <span>Imprimir</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share className="mr-2 h-4 w-4" />
                  <span>Compartilhar</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>Adicionar Comentário</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Flag className="mr-2 h-4 w-4" />
                  <span>Marcar como Importante</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Exame de Imagem */}
      <div className="p-4 border rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileImage className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold">Raio-X do Tórax</h3>
              <p className="text-sm text-muted-foreground">
                18/11/2024 • Centro de Imagem
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-yellow-100 text-yellow-800">
              <AlertTriangle className="mr-1 h-3 w-3" />
              Atenção
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48" align="end">
                <DropdownMenuLabel>Ações da Imagem</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Eye className="mr-2 h-4 w-4" />
                  <span>Visualizar Imagem</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ZoomIn className="mr-2 h-4 w-4" />
                  <span>Ampliar</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" />
                  <span>Baixar DICOM</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Ferramentas</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>
                      <Contrast className="mr-2 h-4 w-4" />
                      <span>Ajustar Contraste</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Brightness className="mr-2 h-4 w-4" />
                      <span>Ajustar Brilho</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <RotateCw className="mr-2 h-4 w-4" />
                      <span>Rotacionar</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Ruler className="mr-2 h-4 w-4" />
                      <span>Medir Distância</span>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>Laudo Médico</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share className="mr-2 h-4 w-4" />
                  <span>Compartilhar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const UserProfileMenu: Story = {
  render: () => (
    <div className="flex items-center space-x-3">
      <Avatar className="h-8 w-8">
        <AvatarImage src="/placeholder-avatar.jpg" />
        <AvatarFallback>DM</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <p className="text-sm font-medium">Dr. Maria Santos</p>
        <p className="text-xs text-muted-foreground">
          Cardiologista • CRM 12345
        </p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel>Dr. Maria Santos</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Meu Perfil</span>
              <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Configurações</span>
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Calendar className="mr-2 h-4 w-4" />
              <span>Minha Agenda</span>
              <DropdownMenuShortcut>⌘A</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Bell className="mr-2 h-4 w-4" />
              <span>Notificações</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Shield className="mr-2 h-4 w-4" />
              <span>Privacidade</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Ajuda</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Monitor className="mr-2 h-4 w-4" />
              <span>Tema</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>
                <Sun className="mr-2 h-4 w-4" />
                <span>Claro</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Moon className="mr-2 h-4 w-4" />
                <span>Escuro</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Monitor className="mr-2 h-4 w-4" />
                <span>Sistema</span>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sair</span>
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
};

export const Simple: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Menu Simples</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Opção 1</DropdownMenuItem>
        <DropdownMenuItem>Opção 2</DropdownMenuItem>
        <DropdownMenuItem>Opção 3</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
