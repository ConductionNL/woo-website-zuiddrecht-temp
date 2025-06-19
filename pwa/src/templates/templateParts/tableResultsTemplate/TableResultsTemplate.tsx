import * as React from "react";
import * as styles from "./TableResultsTemplate.module.css";
import clsx from "clsx";
import {
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
} from "@utrecht/component-library-react/dist/css-module";
import { navigate } from "gatsby";
import { translateDate } from "../../../services/dateFormat";
import { useTranslation } from "react-i18next";
import { HorizontalOverflowWrapper } from "@conduction/components";
import { removeHTMLFromString } from "../../../services/removeHTMLFromString";

interface TableResultsTemplateProps {
  requests: any[];
}

export const TableResultsTemplate: React.FC<TableResultsTemplateProps> = ({ requests }) => {
  const { t, i18n } = useTranslation();

  return (
    <HorizontalOverflowWrapper
      ariaLabels={{
        scrollLeftButton: t("Scroll table to the left"),
        scrollRightButton: t("Scroll table to the right"),
      }}
    >
      <div role="region" aria-label={t("Woo Request")}>
        <Table className={styles.table}>
          <TableHeader className={styles.tableHeader}>
            <TableRow>
              <TableHeaderCell>{t("Subject")}</TableHeaderCell>
              <TableHeaderCell>{t("Publication date")}</TableHeaderCell>
              {(window.sessionStorage.getItem("SHOW_CATEGORY") === "true" ||
                window.sessionStorage.getItem("SHOW_ORGANIZATION") === "true") && (
                <>
                  {window.sessionStorage.getItem("SHOW_ORGANIZATION") === "true" && (
                    <TableHeaderCell>{t("Municipality")}</TableHeaderCell>
                  )}
                  {window.sessionStorage.getItem("SHOW_CATEGORY") === "true" && (
                    <TableHeaderCell>{t("Category")}</TableHeaderCell>
                  )}
                </>
              )}
              <TableHeaderCell>{t("Summary")}</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody className={styles.tableBody}>
            {requests.map((request) => (
              <TableRow
                className={styles.tableRow}
                key={request.id}
                onClick={() => navigate(request.id.toString())}
                tabIndex={0}
                aria-label={`${removeHTMLFromString(removeHTMLFromString(request.title ?? request.titel ?? request.name ?? request.naam ?? request.id))},  ${
                  request.publicatiedatum || request["@self"].created
                    ? translateDate(i18n.language, request.publicatiedatum || request["@self"].created)
                    : t("N/A")
                } ${
                  window.sessionStorage.getItem("SHOW_ORGANIZATION") === "true"
                    ? `,${request["@self"]?.organization?.title ?? request.organization?.title ?? t("No municipality available")}`
                    : ""
                } ${window.sessionStorage.getItem("SHOW_CATEGORY") === "true" ? `, ${request["@self"].schema.title || t("No category available")}` : ""}, ${
                  removeHTMLFromString(removeHTMLFromString(request.summary ?? request.samenvatting ?? "")) ??
                  t("No summary available")
                }`}
              >
                <TableCell>
                  {removeHTMLFromString(
                    removeHTMLFromString(request.title ?? request.titel ?? request.name ?? request.naam ?? request.id),
                  ) ?? t("No subject available")}
                </TableCell>
                <TableCell>
                  {request.publicatiedatum || request["@self"].created
                    ? translateDate(i18n.language, request.publicatiedatum || request["@self"].created)
                    : t("No publication date available")}
                </TableCell>
                {(window.sessionStorage.getItem("SHOW_CATEGORY") === "true" ||
                  window.sessionStorage.getItem("SHOW_ORGANIZATION") === "true") && (
                  <>
                    {window.sessionStorage.getItem("SHOW_ORGANIZATION") === "true" && (
                      <TableCell className={styles.categoryAndMunicipality}>
                        {request["@self"]?.organization?.title ??
                          request.organization?.title ??
                          t("No municipality available")}
                      </TableCell>
                    )}
                    {window.sessionStorage.getItem("SHOW_CATEGORY") === "true" && (
                      <TableCell
                        className={clsx(
                          window.sessionStorage.getItem("SHOW_ORGANIZATION") !== "true" &&
                            styles.categoryAndMunicipality,
                        )}
                      >
                        {request["@self"].schema.title || t("No category available")}
                      </TableCell>
                    )}
                  </>
                )}
                <TableCell>
                  <div className={styles.description}>
                    {removeHTMLFromString(removeHTMLFromString(request.summary ?? request.samenvatting ?? "")) ??
                      t("No summary available")}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </HorizontalOverflowWrapper>
  );
};
