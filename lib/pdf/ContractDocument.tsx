import { readFileSync } from "fs";
import { join } from "path";
import {
  Document,
  Page,
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  Svg,
  Path,
  Line,
  Circle,
  Font,
} from "@react-pdf/renderer";
import type { Reservation, Vehicle } from "@/lib/db";
import {
  DAMAGE_TYPES,
  EQUIPMENT_ITEMS,
  FUEL_LEVELS,
  FUEL_TYPES,
  resolveContractBilling,
  DEFAULT_MIN_RENTAL_DAYS,
} from "@/lib/contract";
import { CONDITIONS_FR, CONDITIONS_AR } from "@/lib/contract-conditions";

const BLUE = "#17327f";
const RED = "#d1121f";
const BLACK = "#000000";

// Fallback shown only when the reservation has no contract number yet.
const DEFAULT_CONTRACT_SERIAL = "00";

// Agency stamp (cachet), printed inside the "Visa Direction" box.
const CACHET_SRC = `data:image/png;base64,${readFileSync(
  join(process.cwd(), "public/cachet.png")
).toString("base64")}`;

// Agency logo, printed in the contract header.
const LOGO_SRC = `data:image/png;base64,${readFileSync(
  join(process.cwd(), "public/logo.png")
).toString("base64")}`;

// Arabic font (IBM Plex Sans Arabic) for the general conditions (page 2).
Font.register({
  family: "IBMPlexArabic",
  fonts: [
    { src: join(process.cwd(), "public/fonts/IBMPlexSansArabic-Regular.woff"), fontWeight: 400 },
    { src: join(process.cwd(), "public/fonts/IBMPlexSansArabic-Bold.woff"), fontWeight: 700 },
  ],
});

// No automatic hyphenation (it breaks Arabic words).
Font.registerHyphenationCallback((word) => [word]);

const styles = StyleSheet.create({
  condPage: { padding: 22, fontFamily: "Helvetica", color: BLACK },
  condHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    border: "1.2 solid " + BLUE,
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginBottom: 6,
  },
  condTitleFr: { fontSize: 12, fontWeight: 800, color: BLUE, width: 170 },
  condTitleCenter: { fontSize: 15, fontWeight: 800, color: BLACK, textAlign: "center" },
  condTitleAr: {
    fontSize: 15,
    fontFamily: "IBMPlexArabic",
    fontWeight: 700,
    color: BLUE,
    width: 170,
    textAlign: "right",
  },
  condBody: {
    flexDirection: "row",
    flexGrow: 1,
    border: "1.2 solid " + BLUE,
    borderRadius: 4,
  },
  condCol: { width: "50%", paddingVertical: 8, paddingHorizontal: 9 },
  condColAr: {
    width: "50%",
    paddingVertical: 8,
    paddingHorizontal: 9,
    borderLeft: "1.2 solid " + BLUE,
  },
  condArticleFr: {
    fontSize: 7.6,
    fontFamily: "Helvetica-BoldOblique",
    color: BLUE,
    marginTop: 4,
    marginBottom: 1.5,
  },
  condItemFr: { fontSize: 7.1, lineHeight: 1.28, marginBottom: 1.8 },
  condArticleAr: {
    fontSize: 7.8,
    fontFamily: "IBMPlexArabic",
    fontWeight: 700,
    color: BLUE,
    textAlign: "right",
    marginTop: 3,
  },
  condRowAr: { flexDirection: "row-reverse", marginBottom: 1.2, paddingRight: 2 },
  condDashAr: { fontSize: 6.8, width: 7, textAlign: "right" },
  condItemAr: {
    flex: 1,
    fontSize: 6.8,
    fontFamily: "IBMPlexArabic",
    fontWeight: 400,
    lineHeight: 1.4,
    textAlign: "right",
  },

  page: { padding: 24, fontSize: 7.5, fontFamily: "Helvetica", color: BLACK },

  // ---- Header ----
  header: { flexDirection: "column", marginBottom: 8 },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 3,
    paddingHorizontal: 2,
  },
  headerSerialBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    border: `1.4 solid ${BLUE}`,
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginTop: 4,
  },
  logo: { width: 110, height: 66, objectFit: "contain" },
  title: { fontSize: 22, fontWeight: 700, color: BLACK },
  serialLabel: { fontSize: 15, fontWeight: 700, color: BLACK },
  serial: { fontSize: 15, fontWeight: 700, color: RED },

  // ---- Cards ----
  row: { flexDirection: "row", gap: 8, marginBottom: 8 },
  col: { flex: 1 },
  card: { border: `1.4 solid ${BLUE}`, borderRadius: 6 },
  cardHeader: {
    backgroundColor: BLUE,
    paddingVertical: 3,
    borderTopLeftRadius: 4.5,
    borderTopRightRadius: 4.5,
  },
  cardHeaderText: { color: "#fff", fontSize: 8, fontWeight: 700, textAlign: "center" },
  cardBody: { padding: 7 },
  box: { border: `1.4 solid ${BLUE}`, borderRadius: 6, padding: 7 },
  boxTitle: { fontSize: 7.5, fontWeight: 700, color: BLUE },

  fieldRow: { flexDirection: "row", alignItems: "flex-end", marginBottom: 6.5 },
  fieldLabel: { fontSize: 7, fontWeight: 700, marginRight: 4 },
  fieldValue: {
    flex: 1,
    fontSize: 7.5,
    borderBottomWidth: 0.75,
    borderBottomStyle: "dotted",
    borderBottomColor: BLACK,
    paddingBottom: 1,
  },
  fieldValueStrong: {
    flex: 1,
    fontSize: 8.5,
    fontWeight: 700,
    borderBottomWidth: 0.75,
    borderBottomStyle: "dotted",
    borderBottomColor: BLACK,
    paddingBottom: 1,
  },

  sigBox: { height: 54 },
  sigImage: { width: "100%", height: 40, objectFit: "contain", marginTop: 2 },

  // ---- Bottom area ----
  leftCol: { width: "52%" },
  rightCol: { flex: 1 },
  fuelBlock: { width: 128 },
  carBox: { flex: 1, alignItems: "center", paddingVertical: 4 },
  checkboxRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 5 },
  checkbox: { width: 8, minWidth: 8, height: 8, flexShrink: 0, border: `1 solid ${BLACK}` },
  checkboxOn: { backgroundColor: BLACK },
  checkboxLabel: { fontSize: 7, fontWeight: 700 },
  equipGrid: { flexDirection: "row" },
  equipCol: { flex: 1 },
  equipLabel: { fontSize: 6.3, fontWeight: 700 },
  legendRow: { flexDirection: "row", gap: 6, marginTop: 2 },
  legendText: { fontSize: 6 },

  visaBox: { height: 70 },
  visaImages: { position: "relative", flex: 1, marginTop: 2 },
  visaImg: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },

  auditLine: { fontSize: 6.5, color: "#333", marginTop: 3 },

  // ---- Footer ----
  footer: {
    position: "absolute",
    bottom: 16,
    left: 24,
    right: 24,
    borderTop: `0.75 solid ${BLUE}`,
    paddingTop: 5,
    alignItems: "center",
  },
  footerText: { fontSize: 6.5, color: BLUE, fontWeight: 700, textAlign: "center" },
});

function formatDate(value?: string | Date | null) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function formatTime(value?: string | null) {
  return value ? String(value).slice(0, 5) : "";
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardHeaderText}>{title}</Text>
      </View>
      <View style={styles.cardBody}>{children}</View>
    </View>
  );
}

// Blank "fillable" mode: every field becomes an editable PDF form input.
// The counter gives each input a unique name (render order is deterministic).
type Fill = { next: () => number };

function FillInput({ fill, flex = 1, strong }: { fill: Fill; flex?: number; strong?: boolean }) {
  return (
    <TextInput
      name={`champ_${fill.next()}`}
      style={{
        flex,
        height: 11,
        fontSize: strong ? 8.5 : 7.5,
        fontWeight: strong ? 700 : 400,
        borderBottomWidth: 0.75,
        borderBottomStyle: "dotted",
        borderBottomColor: BLACK,
      }}
    />
  );
}

function Field({
  label,
  value,
  strong,
  fill,
}: {
  label: string;
  value?: string;
  strong?: boolean;
  fill?: Fill;
}) {
  return (
    <View style={styles.fieldRow}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {fill ? (
        <FillInput fill={fill} strong={strong} />
      ) : (
        <Text style={strong ? styles.fieldValueStrong : styles.fieldValue}>{value || " "}</Text>
      )}
    </View>
  );
}

// Fuel gauge: 0 (left) ... 1/2 (top) ... 1 (right). The needle is only drawn
// when a level was selected by the admin.
function FuelGauge({ level }: { level: string }) {
  const cx = 55;
  const cy = 52;
  const r = 34;
  const pt = (f: number, radius: number) => {
    const t = Math.PI * (1 - f);
    return { x: cx + radius * Math.cos(t), y: cy - radius * Math.sin(t) };
  };
  const ticks = [0, 0.25, 0.5, 0.75, 1];
  const labels: { f: number; text: string; dx: number; dy: number }[] = [
    { f: 0, text: "0", dx: -4, dy: 8 },
    { f: 0.25, text: "1/4", dx: -6, dy: 0 },
    { f: 0.5, text: "1/2", dx: 0, dy: -3 },
    { f: 0.75, text: "3/4", dx: 6, dy: 0 },
    { f: 1, text: "1", dx: 4, dy: 8 },
  ];
  const idx = (FUEL_LEVELS as readonly string[]).indexOf(level);
  const needle = idx >= 0 ? pt(idx / 4, r - 6) : null;
  return (
    <Svg width={110} height={64} viewBox="0 0 110 64">
      <Path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        stroke={BLACK}
        strokeWidth={1}
        fill="none"
      />
      {ticks.map((f) => {
        const a = pt(f, r - 4);
        const b = pt(f, r + 3);
        return <Line key={f} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={BLACK} strokeWidth={1} />;
      })}
      {labels.map((l) => {
        const p = pt(l.f, r + 9);
        return (
          <Text
            key={l.text}
            x={p.x + l.dx}
            y={p.y + l.dy}
            style={{ fontSize: 7, fontWeight: 700 }}
            textAnchor="middle"
          >
            {l.text}
          </Text>
        );
      })}
      {needle ? (
        <Line x1={cx} y1={cy} x2={needle.x} y2={needle.y} stroke={RED} strokeWidth={1.4} />
      ) : null}
      <Circle cx={cx} cy={cy} r={2.5} fill={BLACK} />
    </Svg>
  );
}

// Four-view car sheet (rear, top, right side, left side) used as the damage
// diagram. public/car-diagram.png is 1100x932; the zone positions below are in
// that pixel space and the SVG overlay uses the same viewBox.
const CAR_SRC = `data:image/png;base64,${readFileSync(
  join(process.cwd(), "public/car-diagram.png")
).toString("base64")}`;

const CAR_W = 1100;
const CAR_H = 932;
const CAR_PRINT_W = 134; // pt, fits the carBox next to the fuel block

// Sub-areas of the sheet: [x, y, w, h].
const VIEWS = {
  rear: [11, 0, 454, 279],
  top: [476, 4, 613, 271],
  sideR: [0, 309, 1100, 297],
  sideL: [0, 636, 1100, 296],
} as const;

// Zone -> view + relative position (0..1) inside that view.
// Front of the car points left in the top view and right in the right-side view.
const ZONE_POSITIONS: Record<string, { view: keyof typeof VIEWS; rx: number; ry: number }> = {
  Avant: { view: "top", rx: 0.08, ry: 0.5 },
  Arrière: { view: "rear", rx: 0.5, ry: 0.45 },
  "Côté gauche": { view: "sideL", rx: 0.5, ry: 0.45 },
  "Côté droit": { view: "sideR", rx: 0.5, ry: 0.45 },
  Toit: { view: "top", rx: 0.62, ry: 0.5 },
  "Pare-brise": { view: "top", rx: 0.37, ry: 0.5 },
  Intérieur: { view: "top", rx: 0.5, ry: 0.28 },
  Jantes: { view: "sideR", rx: 0.79, ry: 0.73 },
};

function symbolFor(type: string) {
  return DAMAGE_TYPES.find((t) => t.value === type)?.symbol ?? "?";
}

function CarDiagram({ damages }: { damages: { zone: string; type: string }[] }) {
  const height = (CAR_PRINT_W * CAR_H) / CAR_W;
  const seen: Record<string, number> = {};
  const FONT = 80;
  return (
    <View style={{ width: CAR_PRINT_W, height, position: "relative" }}>
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <Image src={CAR_SRC} style={{ width: CAR_PRINT_W, height }} />
      <Svg
        width={CAR_PRINT_W}
        height={height}
        viewBox={`0 0 ${CAR_W} ${CAR_H}`}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {damages.map((d, i) => {
          const pos = ZONE_POSITIONS[d.zone];
          if (!pos) return null;
          const [bx, by, bw, bh] = VIEWS[pos.view];
          // Several marks on the same zone are spread out so they stay readable.
          const n = (seen[d.zone] = (seen[d.zone] ?? -1) + 1);
          const x = bx + pos.rx * bw + (n % 2 === 0 ? 1 : -1) * Math.ceil(n / 2) * 55;
          const y = by + pos.ry * bh + FONT * 0.35;
          return (
            <Text
              key={i}
              x={x}
              y={y}
              fill={RED}
              style={{ fontSize: FONT, fontFamily: "Helvetica-Bold" }}
              textAnchor="middle"
            >
              {symbolFor(d.type)}
            </Text>
          );
        })}
      </Svg>
    </View>
  );
}

function splitName(full: string) {
  const parts = (full ?? "").trim().split(/\s+/).filter(Boolean);
  return { first: parts[0] ?? "", last: parts.slice(1).join(" ") };
}

type DriverView = {
  first: string;
  last: string;
  cin: string;
  cinIssue: string;
  birth: string;
  license: string;
  licenseIssue: string;
  address: string;
  phone: string;
  passport: string;
  passportIssue: string;
};

function DriverCard({ title, d, fill }: { title: string; d: DriverView; fill?: Fill }) {
  return (
    <Card title={title}>
      <Field label="PRÉNOM :" value={d.first} fill={fill} />
      <Field label="NOM :" value={d.last} fill={fill} />
      <Field label="C.I.N. :" value={d.cin} fill={fill} />
      <Field label="Délivré le :" value={d.cinIssue} fill={fill} />
      <Field label="Date de Naissance :" value={d.birth} fill={fill} />
      <Field label="Permis de conduire N° :" value={d.license} fill={fill} />
      <Field label="Délivré le :" value={d.licenseIssue} fill={fill} />
      <Field label="ADRESSE AU MAROC :" value={d.address} fill={fill} />
      <Field label="TEL :" value={d.phone} fill={fill} />
      <Field label="Passeport N° :" value={d.passport} fill={fill} />
      <Field label="Délivré le :" value={d.passportIssue} fill={fill} />
    </Card>
  );
}

function ConditionsPage() {
  return (
    <Page size="A4" style={styles.condPage} wrap={false}>
      <View style={styles.condHeader}>
        <Text style={styles.condTitleFr}>Conditions G{"\u00e9"}n{"\u00e9"}rales</Text>
        <Text style={styles.condTitleCenter}>ST{"\u00c9"} AHMED RED CAR S.A.R.L</Text>
        <Text style={styles.condTitleAr}>الشروط العامة</Text>
      </View>

      <View style={styles.condBody}>
        <View style={styles.condCol}>
          {CONDITIONS_FR.map((a) => (
            <View key={a.title}>
              <Text style={styles.condArticleFr}>{a.title}</Text>
              {a.items.map((item) => (
                <Text key={item} style={styles.condItemFr}>
                  {a.plain ? item : "- " + item}
                </Text>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.condColAr}>
          {CONDITIONS_AR.map((a) => (
            <View key={a.title}>
              <Text style={styles.condArticleAr}>{a.title}</Text>
              {a.items.map((item) => (
                <View key={item} style={styles.condRowAr}>
                  <Text style={styles.condDashAr}>-</Text>
                  <Text style={styles.condItemAr}>{"\u200F" + item}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </View>
    </Page>
  );
}

export function ContractDocument({
  reservation,
  vehicle,
  fillable = false,
}: {
  reservation: Reservation;
  vehicle: Vehicle | null;
  fillable?: boolean;
}) {
  const vehiclePricing = {
    price_per_day: vehicle?.price_per_day ?? 0,
    price_extended_15: vehicle?.price_extended_15 ?? vehicle?.price_per_day ?? 0,
    price_monthly_30: vehicle?.price_monthly_30 ?? vehicle?.price_per_day ?? 0,
    min_rental_days: vehicle?.min_rental_days ?? DEFAULT_MIN_RENTAL_DAYS,
  };
  const billing = resolveContractBilling(vehiclePricing, reservation);
  const r = reservation;

  const main = splitName(r.full_name);
  const second = splitName(r.second_driver_full_name);
  const d1: DriverView = {
    first: r.first_name || main.first,
    last: r.last_name || main.last,
    cin: r.cin_number,
    cinIssue: formatDate(r.cin_issue_date),
    birth: formatDate(r.birth_date),
    license: r.driver_license_number,
    licenseIssue: formatDate(r.license_issue_date),
    address: r.driver_address,
    phone: r.driver_phone,
    passport: r.driver_passport_number,
    passportIssue: formatDate(r.passport_issue_date),
  };
  const has2 = r.has_second_driver;
  const d2: DriverView = {
    first: has2 ? r.second_driver_first_name || second.first : "",
    last: has2 ? r.second_driver_last_name || second.last : "",
    cin: has2 ? r.second_driver_cin_number : "",
    cinIssue: has2 ? formatDate(r.second_driver_cin_issue_date) : "",
    birth: has2 ? formatDate(r.second_driver_birth_date) : "",
    license: has2 ? r.second_driver_license_number : "",
    licenseIssue: has2 ? formatDate(r.second_driver_license_issue_date) : "",
    address: has2 ? r.second_driver_address : "",
    phone: has2 ? r.second_driver_phone : "",
    passport: has2 ? r.second_driver_passport_number : "",
    passportIssue: has2 ? formatDate(r.second_driver_passport_issue_date) : "",
  };

  const money = (n: number) => `${n.toFixed(2)} DH`;
  let fillN = 0;
  const fill: Fill | undefined = fillable ? { next: () => ++fillN } : undefined;
  const CONTRACT_SERIAL = r.contract_number?.trim() || DEFAULT_CONTRACT_SERIAL;

  return (
    <Document title={`Contrat ${CONTRACT_SERIAL}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image src={LOGO_SRC} style={styles.logo} />
            <Text style={styles.title}>CONTRAT DE LOCATION</Text>
          </View>
          <View style={styles.headerSerialBox}>
            <Text style={styles.serialLabel}>N°</Text>
            <Text style={styles.serial}>{CONTRACT_SERIAL}</Text>
          </View>
        </View>

        {/* Premier / 2ème conducteur */}
        <View style={styles.row}>
          <View style={styles.col}>
            <DriverCard title="Premier Conducteur" d={d1} fill={fill} />
          </View>
          <View style={styles.col}>
            <DriverCard title="2ème Conducteur" d={d2} fill={fill} />
          </View>
        </View>

        {/* Signatures */}
        <View style={styles.row}>
          <View style={[styles.col, styles.box, styles.sigBox]}>
            <Text style={styles.boxTitle}>Signature 1</Text>
            <Text style={styles.boxTitle}>Conducteur</Text>
            {r.signature_data ? (
              // eslint-disable-next-line jsx-a11y/alt-text
              <Image src={r.signature_data} style={styles.sigImage} />
            ) : null}
          </View>
          <View style={[styles.col, styles.box, styles.sigBox]}>
            <Text style={styles.boxTitle}>Signature 2</Text>
            <Text style={styles.boxTitle}>Conducteur</Text>
            {r.signature_2_data ? (
              // eslint-disable-next-line jsx-a11y/alt-text
              <Image src={r.signature_2_data} style={styles.sigImage} />
            ) : null}
          </View>
        </View>

        {/* Départ / Retour / Facturation / Carburant / Dommages / Visa */}
        <View style={styles.row}>
          <View style={styles.leftCol}>
            <View style={[styles.row, { marginBottom: 8 }]}>
              <View style={styles.col}>
                <Card title="DEPART">
                  <Field label="Le :" value={formatDate(r.start_date)} fill={fill} />
                  <Field label="H :" value={formatTime(r.start_time)} fill={fill} />
                  <Field label="Lieu de livraison :" value={r.departure_place} fill={fill} />
                </Card>
              </View>
              <View style={styles.col}>
                <Card title="RETOUR">
                  <Field label="Le :" value={formatDate(r.end_date)} fill={fill} />
                  <Field label="H :" value={formatTime(r.end_time)} fill={fill} />
                  <Field label="Lieu de livraison :" value={r.return_place} fill={fill} />
                </Card>
              </View>
            </View>

            <View style={[styles.row, { marginBottom: 0 }]}>
              <View style={styles.fuelBlock}>
                <FuelGauge level={r.fuel_level} />
                <Text style={[styles.checkboxLabel, { marginTop: 4 }]}>CARBURANT :</Text>
                {FUEL_TYPES.map((t) => (
                  <View key={t.value} style={styles.checkboxRow}>
                    <View style={[styles.checkbox, ...(r.fuel_type === t.value ? [styles.checkboxOn] : [])]} />
                    <Text style={styles.checkboxLabel}>{t.label}</Text>
                  </View>
                ))}
              </View>
              <View style={[styles.box, styles.carBox]}>
                <CarDiagram damages={r.damages} />
                <View style={styles.legendRow}>
                  {DAMAGE_TYPES.map((t) => (
                    <Text key={t.value} style={styles.legendText}>
                      {t.symbol} {t.value}
                    </Text>
                  ))}
                </View>
              </View>
            </View>

            {/* Equipement du vehicule (cases cochees depuis l'admin) */}
            <View style={{ marginTop: 8 }}>
              <Card title={"ÉQUIPEMENT DU VÉHICULE"}>
                <View style={styles.equipGrid}>
                  {[
                    EQUIPMENT_ITEMS.slice(0, 4),
                    EQUIPMENT_ITEMS.slice(4, 8),
                  ].map((items, c) => (
                    <View key={c} style={styles.equipCol}>
                      {items.map((item) => (
                        <View key={item.key} style={[styles.checkboxRow, { marginTop: 0, marginBottom: 4 }]}>
                          <View
                            style={[
                              styles.checkbox,
                              ...(r.equipment?.[item.key] ? [styles.checkboxOn] : []),
                            ]}
                          />
                          <Text style={styles.equipLabel}>{item.label}</Text>
                        </View>
                      ))}
                    </View>
                  ))}
                </View>
                {/* Long item (kit de securite) on its own full-width row */}
                {EQUIPMENT_ITEMS.slice(8).map((item) => (
                  <View key={item.key} style={[styles.checkboxRow, { marginTop: 0, marginBottom: 4 }]}>
                    <View
                      style={[
                        styles.checkbox,
                        ...(r.equipment?.[item.key] ? [styles.checkboxOn] : []),
                      ]}
                    />
                    <Text style={[styles.equipLabel, { flex: 1 }]}>{item.label}</Text>
                  </View>
                ))}
              </Card>
            </View>
          </View>

          <View style={styles.rightCol}>
            <View style={[styles.box, { marginBottom: 6 }]}>
              <Field label="Type de véhicule :" value={vehicle ? `${vehicle.brand} ${vehicle.model}` : r.vehicle_label} fill={fill} />
              <Field label="Matricule :" value={r.registration_plate} fill={fill} />
              <Field label="Nombre de jours :" value={`${billing.days}`} fill={fill} />
              <Field label="Prix par jours :" value={money(billing.dailyRate)} fill={fill} />
              <Field label="Total TTC :" value={money(billing.totalTTC)} strong fill={fill} />
              <Field label="Avance :" value={money(billing.advance)} fill={fill} />
              <Field label="Reste à payer :" value={money(billing.remaining)} strong fill={fill} />
            </View>
            <View style={[styles.box, { marginBottom: 6 }]}>
              <Field label="Prolongation :" value={r.prolongation} fill={fill} />
            </View>
            <View style={[styles.box, { marginBottom: 6 }]}>
              <View style={[styles.fieldRow, { marginBottom: 0 }]}>
                <Text style={styles.fieldLabel}>Retour Prévu le :</Text>
                {fillable ? (
                  <FillInput fill={fill!} flex={2} />
                ) : (
                  <Text style={[styles.fieldValue, { flex: 2 }]}>{formatDate(r.expected_return_date) || " "}</Text>
                )}
                <Text style={[styles.fieldLabel, { marginLeft: 4 }]}>à :</Text>
                {fillable ? (
                  <FillInput fill={fill!} />
                ) : (
                  <Text style={styles.fieldValue}>{formatTime(r.expected_return_time) || " "}</Text>
                )}
              </View>
            </View>
            <View style={[styles.box, { marginBottom: 6 }]}>
              <View style={[styles.fieldRow, { marginBottom: 5 }]}>
                <Text style={styles.fieldLabel}>Franchise incluse :</Text>
                {[
                  { value: "yes", label: "Oui" },
                  { value: "no", label: "Non" },
                ].map((o) => (
                  <View key={o.value} style={[styles.checkboxRow, { marginTop: 0, marginRight: 10 }]}>
                    <View
                      style={[
                        styles.checkbox,
                        ...(r.franchise_included === o.value ? [styles.checkboxOn] : []),
                      ]}
                    />
                    <Text style={styles.checkboxLabel}>{o.label}</Text>
                  </View>
                ))}
              </View>
              <Field
                label="Prix donné par client (franchise) :"
                value={r.franchise_amount != null ? money(Number(r.franchise_amount)) : ""}
                fill={fill}
              />
            </View>
            <View style={[styles.box, styles.visaBox]}>
              <Text style={styles.boxTitle}>Visa Direction :</Text>
              <View style={styles.visaImages}>
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image src={CACHET_SRC} style={styles.visaImg} />
                {r.admin_signature_data ? (
                  // eslint-disable-next-line jsx-a11y/alt-text
                  <Image src={r.admin_signature_data} style={styles.visaImg} />
                ) : null}
              </View>
            </View>
          </View>
        </View>

        {r.signed_at && (
          <Text style={styles.auditLine}>
            Signé électroniquement le {new Date(r.signed_at).toLocaleString("fr-FR")} par{" "}
            {r.signer_name} (IP: {r.signer_ip})
          </Text>
        )}
        {r.signed_2_at && (
          <Text style={styles.auditLine}>
            2ème conducteur signé électroniquement le{" "}
            {new Date(r.signed_2_at).toLocaleString("fr-FR")} par {r.signer_2_name} (IP:{" "}
            {r.signer_2_ip})
          </Text>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            20, Rue Ghana App N°2 1er étage Diour Jamaa Rabat — Tél : +212 664 883 106 / +212 661 412 759
          </Text>
          <Text style={styles.footerText}>RC 195159   Ice 003887345000050</Text>
        </View>
      </Page>

      {/* Page 2: Conditions Generales */}
      <ConditionsPage />
    </Document>
  );
}