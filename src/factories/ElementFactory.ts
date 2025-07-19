import React from "react";
import { ElementTypeEnum } from "../enums/ElementTypeEnum";
import type { ElementType } from "website-lib";
import TextElement from "../elements/TextElement";
import InputElement from "../elements/InputElement";
import AlertElement from "../elements/AlertElement";
import ButtonElement from "../elements/ButtonElement";
import LinkElement from "../elements/LinkElement";

export function elementFactory(type: number, element: ElementType): React.ReactElement | null {
  switch (type) {
    case ElementTypeEnum.Text:
      return React.createElement(TextElement, { element, showSettings: true });
    case ElementTypeEnum.Input:
      return React.createElement(InputElement, { element });
    case ElementTypeEnum.Alert:
      return React.createElement(AlertElement, { element });
    case ElementTypeEnum.Button:
      return React.createElement(ButtonElement, { element });
    case ElementTypeEnum.Link:
      return React.createElement(LinkElement, { element });
    default:
      return null;
  }
}